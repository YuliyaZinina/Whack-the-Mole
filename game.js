const gameMenu = document.getElementById('menu');
const holes = document.querySelectorAll('.hole');
const scoreBoard = document.getElementById('score');
const moles = document.querySelectorAll('.mole');
const returnGameBtn = document.getElementById('return-game');

let lastHole;
let timeUp = false;
let failed = false;
let timer = 5000;

let score = JSON.parse(localStorage.getItem('score')) || 0;
let bestScore = JSON.parse(localStorage.getItem('bestScore')) || 0;

function randomTime(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
	const idx = Math.floor(Math.random() * holes.length);
	const hole = holes[idx];
	if (hole === lastHole) {
		return randomHole(holes);
	}
	lastHole = hole;
	return hole;
}

function peep() {
	const time = randomTime(200, 1000);
	const hole = randomHole(holes);
	hole.classList.add('up');
	setTimeout(() => {
		hole.classList.remove('up');
		if (!timeUp)
			peep();
	}, time);
}

function getScore() {
	return score;
}

function gameover() {
	timeUp = true;
	gameMenu.classList.remove('hide');
	failed = true;
	if (score > bestScore) {
		localStorage.setItem('bestScore', score);
	}
	localStorage.setItem('score', 0);
	returnGameBtn.classList.add('hide');
	document.getElementById('max-score').innerHTML = JSON.parse(localStorage.getItem('bestScore')) || 0;
}

function continueGame(score) {
	let currentScore = score;
	let gameInterval = setInterval(() => {
		score = getScore();
		if (currentScore === score) {
			gameover();
			clearInterval(gameInterval);
			return;
		} else {
			currentScore = score;
		}
	}, timer);
}

function startGame() {
	gameMenu.classList.add('hide');
	scoreBoard.textContent = 0;
	localStorage.setItem('score', 0);
	timeUp = false;
	score = 0;
	failed = false;
	peep();
	continueGame(score);
}

function returnGame() {
	if (failed)
		return;
	gameMenu.classList.add('hide');
	timeUp = false;
	peep();
	continueGame(score);
}

function bonk(e) {
	if (!e.isTrusted)
		return;
	score++;
	this.classList.remove('up');
	scoreBoard.textContent = score;
}

document.getElementById('start-game').addEventListener('click', startGame);
returnGameBtn.addEventListener('click', returnGame);


moles.forEach(mole => mole.addEventListener('click', bonk));
window.addEventListener('keypress', (e) => {
	e.preventDefault();
	if (e.keyCode === 32 && !timeUp) {
		timeUp = true;
		localStorage.setItem('score', score);
		gameMenu.classList.remove('hide');
	}
});

document.getElementById('max-score').innerHTML = JSON.parse(localStorage.getItem('bestScore')) || 0;
scoreBoard.textContent = !failed ? score : 0;