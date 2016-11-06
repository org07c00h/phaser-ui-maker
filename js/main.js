var game;
var showMenu = false;
var currentImage = null;
var imageOptions;
var command = null;
var canvas;
var centerPointer;
// scale
var scaleUI = {
	nw: null,
	ne: null,
	sw: null,
	se: null,
	s: null,
	w: null,
	e: null,
	n: null
};
(function () {
	console.clear();
	//	Create your Phaser game and inject it into the game div.
	//	We did it in a window.onload event, but you can do it anywhere (requireJS load, anonymous function, jQuery dom ready, - whatever floats your boat)
	//	We're using a game size of 1024 x 768 here, but you can use whatever you feel makes sense for your game of course.
	game = new Phaser.Game(720, 1280, Phaser.AUTO, 'game', null);

	//	Add the States your game has.
	//	You don't have to do this in the html, it could be done in your Boot state too, but for simplicity I'll keep it here.
	game.state.add('Boot', BasicGame.Boot, true);
	game.state.add('Preloader', BasicGame.Preloader, false);
	game.state.add('MainMenu', BasicGame.MainMenu, false);
	game.state.add('Game', BasicGame.Game, false);

	//	Now start the Boot state.
	game.state.start('Boot');
	// add some events
	window.onload = function() {
		let b = document.getElementsByClassName('add')[0];
		canvas = document.getElementsByTagName('canvas')[0];

		imageOptions = document.getElementsByClassName('options')[0];
		b.addEventListener('click', (ev) => {
			showMenu = true;
			currentImage = null;
		});
		let save = document.getElementsByClassName('save')[0];
		save.addEventListener('click', (ev) => {
			currentImage.options.type = document.getElementById("type").value;
			currentImage.x = +document.getElementById("pos_x").value;
			currentImage.y = +document.getElementById("pos_y").value;
			currentImage.anchor.x = +document.getElementById("anchor_x").value;
			currentImage.anchor.y = +document.getElementById("anchor_y").value;
			currentImage.scale.x = +document.getElementById("scale_x").value;
			currentImage.scale.y = +document.getElementById("scale_y").value;
			currentImage.angle = +document.getElementById("angle").value;
			updateUIPosition();
		});
		document.addEventListener('keyup', (ev) => {
			if (currentImage != null) {
				console.log(ev);
				switch (ev.keyCode) {
					case 83:
						toggleScaleUI();
					break;
					case 65:
						toggleAnchorUI();
					break;
					case 82:
						console.log('rotate me');
					break;
					default:
					break;
				}
			}
		});
	}
})();

function getRandomElementFromArray(arr) {
	let id = Math.floor(Math.random() * (arr.length));
	return arr[id];
}
function toggleAnchorUI() {
	if (centerPointer.alpha == 1) {
		centerPointer.alpha = 0;
	} else {
		centerPointer.alpha = 1;
	}
	centerPointer.x = currentImage.x;
	centerPointer.y = currentImage.y;
	centerPointer.anchor.set(0.5);
	//  todo 1 (disable other intefrace elemts) +0: 
	disableScaleUI();

}
function toggleScaleUI() {
	let keys = Object.keys(scaleUI);
	keys.forEach((key) => {
		if (scaleUI[key].alpha == 1) {
			scaleUI[key].alpha = 0;
		} else {
			scaleUI[key].alpha = 1;
		}
		scaleUI[key].inputEnabled = !scaleUI[key].inputEnabled;
	    scaleUI[key].input.enableDrag(scaleUI[key].inputEnabled);
	});
	updateUIPosition();
}
function disableScaleUI() {
	for(let key in scaleUI) {
		scaleUI[key].alpha = 0;
		scaleUI[key].inputEnabled = false;
	    scaleUI[key].input.enableDrag(false);
	}
}
function updateUIPosition() {
	scaleUI.ne.x = currentImage.x + currentImage.width * (1 - currentImage.anchor.x);
	scaleUI.ne.y = currentImage.y - currentImage.height * currentImage.anchor.y;
	// rotateUI(scaleUI)
	scaleUI.nw.x = currentImage.x - currentImage.width * (currentImage.anchor.x);
	scaleUI.nw.y = currentImage.y - currentImage.height * currentImage.anchor.y;

	scaleUI.sw.x = currentImage.x - currentImage.width * (currentImage.anchor.x);
	scaleUI.sw.y = currentImage.y + currentImage.height * (1 - currentImage.anchor.y);

	scaleUI.se.x = currentImage.x + currentImage.width * (1 - currentImage.anchor.x);
	scaleUI.se.y = currentImage.y + currentImage.height * (1 - currentImage.anchor.y);

	scaleUI.n.x = currentImage.x + currentImage.width * (0.5 - currentImage.anchor.x);
	scaleUI.n.y = currentImage.y - currentImage.height * currentImage.anchor.y;

	scaleUI.s.x = currentImage.x + currentImage.width * (0.5 - currentImage.anchor.x);
	scaleUI.s.y = currentImage.y + currentImage.height * (1 - currentImage.anchor.y);

	scaleUI.w.x = currentImage.x - currentImage.width * (currentImage.anchor.x);
	scaleUI.w.y = currentImage.y + currentImage.height * (0.5 - currentImage.anchor.y);
	
	scaleUI.e.x = currentImage.x + currentImage.width * (1 - currentImage.anchor.x);
	scaleUI.e.y = currentImage.y + currentImage.height * (0.5 - currentImage.anchor.y);
	for(let key in scaleUI) {
		rotateUI(scaleUI[key]);
	}
}
function rotateUI(image) {
	let x = image.x - currentImage.x;
	let y = image.y - currentImage.y;
	let angle = Math.PI * currentImage.angle / 180;
	image.x = Math.cos(angle) * x - Math.sin(angle) * y + currentImage.x;
	image.y = Math.sin(angle) * x + Math.cos(angle) * y + currentImage.y;

}