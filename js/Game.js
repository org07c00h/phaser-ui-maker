BasicGame.Game = function (game) {

	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;	//	the tween manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator
    this.buttons;
    this.ui;
    this.interface;
    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

BasicGame.Game.prototype = {

	create: function () {
        let x = 0;
        let y = 0;
        let bgImage = game.add.image(x, 0, 'bg');
        for (let i = 0; i < game.world.width / bgImage.width; i++) {
            for (let j = 0; j < game.world.height / bgImage.height; j++) {
                game.add.image(bgImage.width * i, bgImage.height * j, 'bg');
            }
        }
        this.buttons = game.add.group();
        this.ui = game.add.group();
        this.interface = game.add.group();
        // initialize square for scaling
        for (var key in scaleUI) {
            let square = game.add.image(20, 20, 'square');
            square.alpha = 0;
            this.interface.add(square);
            scaleUI[key] = square;
            scaleUI[key].inputEnabled = false;
            square.key = key;   // js sucks
            scaleUI[key].events.onInputOver.add((square) => {
                canvas.style.cursor = square.key + "-resize";
            }, this);
            scaleUI[key].events.onInputOut.add(() => {
                canvas.style.cursor = "default";
            });
        }
        this.configureScaleButtons();
        centerPointer = game.add.image(120, 20, 'centerPointer');
        let images = game.cache._cacheMap[Phaser.Cache.IMAGE];
        let frames = images.atlas.frameData._frames;
        y = 20;
        for (let i = 0; i < frames.length; i++) {
            let frame =  images.atlas.frameData._frames[i];
            let image = game.add.image(game.world.centerX - 100, y, "atlas", frame.name);
            image.inputEnabled = true;
            image.events.onInputDown.add((image) => {
                this.ui.alpha = 1;
                this.toggleAtlasInput();
                let img = game.add.sprite(game.world.centerX, game.world.centerY, "atlas", image._frame.name);
                img.inputEnabled = true;
                img.input.enableDrag();
                img.options = {
                    type: "sprite",
                    height: img.height,
                    width: img.width
                };
                img.events.onInputDown.add((image) => {
                    updateOptions(image);
                    this.interface.alpha = 1;
                }, this);
                img.events.onDragUpdate.add((image) => {
                    updateUIPosition(image);
                }, this)
                img.events.onDragStop.add((image) => {
                    canvas.style.cursor = "default";
                    updateOptions(image);
                }, this);
                img.events.onDragStart.add(()=> {
                    canvas.style.cursor = "move";
                }, this)
                // img.events.on
                this.ui.add(img);
                this.buttons.alpha = 0;
            }, this);
            y += image.height + 10;
            this.buttons.add(image);
        }
		//	Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

	},

	update: function () {
		//	Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        if (showMenu) {
            this.toggleAtlasInput();
            disableScaleUI();
            this.buttons.alpha = 1;
            this.ui.alpha = 0;
            this.interface.alpha = 0;
            showMenu = false;
        }
	},

	quitGame: function (pointer) {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
		this.state.start('MainMenu');

	}
};
function updateOptions(image) {
    currentImage = image;
    imageOptions.style.display = "block";
    document.getElementById("type").value = image.options.type;
    document.getElementById("pos_x").value = image.x;
    document.getElementById("pos_y").value = image.y;
    document.getElementById("scale_x").value = image.scale.x;
    document.getElementById("scale_y").value = image.scale.y;
    document.getElementById("anchor_x").value = image.anchor.x;
    document.getElementById("anchor_y").value = image.anchor.y;
    document.getElementById("angle").value = image.angle;
}
BasicGame.Game.prototype.toggleAtlasInput = function() {
    this.buttons.children.forEach((image) => {
        image.inputEnabled = !image.inputEnabled;
    });
    this.toggleUIInput();
}
BasicGame.Game.prototype.toggleUIInput = function () {
    this.ui.children.forEach((image) => {
        image.inputEnabled = !image.inputEnabled;
    });
}
BasicGame.Game.prototype.configureScaleButtons = function() {
    scaleUI.ne.anchor.set(1, 0);
    scaleUI.e.anchor.set(1, 0.5);
    scaleUI.se.anchor.set(1, 1);
    scaleUI.s.anchor.set(0.5, 1);
    scaleUI.sw.anchor.set(0, 1);
    scaleUI.w.anchor.set(0, 0.5);
    scaleUI.n.anchor.set(0.5, 0);
    // north input

    scaleUI.n.events.onInputDown.add((image) => {
        if (currentImage.anchor.y != 1) {
            currentImage.anchor.y = 1;
            currentImage.y += currentImage.height;
        }
    });
    
    scaleUI.n.events.onDragUpdate.add((image) => {
        image.x = currentImage.x + currentImage.width * (0.5 - currentImage.anchor.x);
        currentImage.scale.y = Math.abs(image.y - currentImage.y) / currentImage.options.height;
        updateUIPosition();
        updateOptions(currentImage);
    }, this);
    // east input

    scaleUI.e.events.onInputDown.add((image) => {
        if (currentImage.anchor.x != 0) {
            currentImage.anchor.x = 0;
            currentImage.x -= currentImage.width;
        }
    });
    scaleUI.e.events.onDragUpdate.add((image) => {
        image.y = currentImage.y + currentImage.height * (0.5 - currentImage.anchor.y);
        currentImage.scale.x = Math.abs(image.x - currentImage.x) / currentImage.options.width;
        updateUIPosition();
        updateOptions(currentImage);
    }, this);
    scaleUI.w.events.onInputDown.add((image) => {
        if (currentImage.anchor.x != 1) {
            currentImage.anchor.x = 1;
            currentImage.x += currentImage.width;
        }
    });
    scaleUI.w.events.onDragUpdate.add((image) => {
        image.y = currentImage.y + currentImage.height * (0.5 - currentImage.anchor.y);
        currentImage.scale.x = Math.abs(image.x - currentImage.x) / currentImage.options.width;
        updateUIPosition();
        updateOptions(currentImage);
    }, this);
    // south input 

    scaleUI.s.events.onInputDown.add((image) => {
        if (currentImage.anchor.y != 0) {
            currentImage.anchor.y = 0;
            currentImage.y -= currentImage.height;
        }
    });
    scaleUI.s.events.onDragUpdate.add((image) => {
        image.x = currentImage.x + currentImage.width * (0.5 - currentImage.anchor.x);
        currentImage.scale.y = Math.abs(image.y - currentImage.y) / currentImage.options.height;
        updateUIPosition();
        updateOptions(currentImage);
    }, this);
    // ne input
    scaleUI.ne.events.onInputDown.add((image) => {
        if (currentImage.anchor.y != 1) {
            currentImage.anchor.y = 1;
            currentImage.y += currentImage.height;
        }
        if (currentImage.anchor.x != 0) {
            currentImage.anchor.x = 0;
            currentImage.x -= currentImage.width;
        }
    });
    scaleUI.ne.events.onDragUpdate.add((image) => {
        currentImage.scale.x = Math.abs(image.x - currentImage.x) / currentImage.options.width;
        currentImage.scale.y = Math.abs(image.y - currentImage.y) / currentImage.options.height;
        updateUIPosition();
        updateOptions(currentImage);
    }, this);
    // nw input 
    scaleUI.nw.events.onInputDown.add((image) => {
        if (currentImage.anchor.y != 1) {
            currentImage.anchor.y = 1;
            currentImage.y += currentImage.height;
        }
        if (currentImage.anchor.x != 1) {
            currentImage.anchor.x = 1;
            currentImage.x += currentImage.width;
        }
    });
    scaleUI.nw.events.onDragUpdate.add((image) => {
        currentImage.scale.x = Math.abs(image.x - currentImage.x) / currentImage.options.width;
        currentImage.scale.y = Math.abs(image.y - currentImage.y) / currentImage.options.height;
        updateUIPosition();
        updateOptions(currentImage);
    }, this);
    // sw
    scaleUI.sw.events.onInputDown.add((image) => {
        if (currentImage.anchor.y != 0) {
            currentImage.anchor.y = 0;
            currentImage.y -= currentImage.height;
        }
        if (currentImage.anchor.x != 1) {
            currentImage.anchor.x = 1;
            currentImage.x += currentImage.width;
        }
    });
    scaleUI.sw.events.onDragUpdate.add((image) => {
        currentImage.scale.x = Math.abs(image.x - currentImage.x) / currentImage.options.width;
        currentImage.scale.y = Math.abs(image.y - currentImage.y) / currentImage.options.height;
        updateUIPosition();
        updateOptions(currentImage);
    }, this);
    // se
    scaleUI.se.events.onInputDown.add((image) => {
        if (currentImage.anchor.y != 0) {
            currentImage.anchor.y = 0;
            currentImage.y -= currentImage.height;
        }
        if (currentImage.anchor.x != 0) {
            currentImage.anchor.x = 0;
            currentImage.x -= currentImage.width;
        }
    }, this);
    scaleUI.se.events.onDragUpdate.add((image) => {
        currentImage.scale.x = Math.abs(image.x - currentImage.x) / currentImage.options.width;
        currentImage.scale.y = Math.abs(image.y - currentImage.y) / currentImage.options.height;
        updateUIPosition();
        updateOptions(currentImage);
    }, this);

}