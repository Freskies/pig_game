"use strict";

// COSTANTS
const GAME_RUNNING = 1;
const GAME_FINISHED = -1;

const SCORE_TO_WIN = 40;

const TURN_P1 = 1;
const TURN_P2 = 2;

// DOM ELEMENTS
const PLAYER1 = document.querySelector(".player--p1");
const PLAYER2 = document.querySelector(".player--p2");
const TOTAL_SCORE_P1 = document.querySelector(".total-score--p1");
const TOTAL_SCORE_P2 = document.querySelector(".total-score--p2");
const CURRENT_SCORE_P1 = document.querySelector(".current-score--p1");
const CURRENT_SCORE_P2 = document.querySelector(".current-score--p2");
const DICE = document.querySelector(".dice");
const BUTTON_NEW = document.querySelector(".btn--new-game");
const BUTTON_ROLL = document.querySelector(".btn--roll-dice");
const BUTTON_HOLD = document.querySelector(".btn--hold");

// STATE
let game_status = GAME_RUNNING;
let active_player = TURN_P1;
let diceValue = 0;

let current_score_p1 = 0;
let current_score_p2 = 0;

let total_score_p1 = 0;
let total_score_p2 = 0;

function updateScoreP1() {
	CURRENT_SCORE_P1.textContent = current_score_p1;
}

function updateScoreP2() {
	CURRENT_SCORE_P2.textContent = current_score_p2;
}

function resetCurrentScoreP1() {
	current_score_p1 = 0;
	updateScoreP1();
}

function resetCurrentScoreP2() {
	current_score_p2 = 0;
	updateScoreP2();
}

function addToCurrentScoreP1(score) {
	current_score_p1 += score;
	updateScoreP1();
	return current_score_p1;
}

function addToCurrentScoreP2(score) {
	current_score_p2 += score;
	updateScoreP2();
	return current_score_p2;
}

function updateTotalScoreP1() {
	TOTAL_SCORE_P1.textContent = total_score_p1;
}

function updateTotalScoreP2() {
	TOTAL_SCORE_P2.textContent = total_score_p2;
}

function resetTotalScoreP1() {
	total_score_p1 = 0;
	updateTotalScoreP1();
}

function resetTotalScoreP2() {
	total_score_p2 = 0;
	updateTotalScoreP2();
}

function addToTotalScoreP1(score) {
	total_score_p1 += score;
	updateTotalScoreP1();
	return total_score_p1;
}

function addToTotalScoreP2(score) {
	total_score_p2 += score;
	updateTotalScoreP2();
	return total_score_p2;
}

function setDiceValue(value) {
	diceValue = value;
	DICE.src = `img/dice-${value}.png`;
	return diceValue;
}

function setActivePlayer(player) {
	active_player = player;
	switch (active_player) {
		case TURN_P1:
			PLAYER1.classList.add("player--active");
			PLAYER2.classList.remove("player--active");
			break;
		case TURN_P2:
			PLAYER2.classList.add("player--active");
			PLAYER1.classList.remove("player--active");
			break;
		default:
			console.log("Error in setActivePlayer");
	}
}

// EDIT STATE

// OTHER FUNCTION

function roll_dice() {
	return setDiceValue(Math.trunc(Math.random() * 6) + 1);
}

function switchTurn() {
	setActivePlayer(active_player === TURN_P1 ? TURN_P2 : TURN_P1);
}

// EVENTS LISTENERS

function rollListener() {
	if (game_status === GAME_RUNNING) {
		if (DICE.classList.contains("hidden")) DICE.classList.remove("hidden");

		let roll = roll_dice();

		// roll 1
		if (roll === 1) {
			switch (active_player) {
				case TURN_P1:
					resetCurrentScoreP1();
					break;
				case TURN_P2:
					resetCurrentScoreP2();
					break;
				default:
					console.log("Error Roll 1");
			}
			switchTurn();
		}

		// roll 2 to 6
		else {
			switch (active_player) {
				case TURN_P1:
					addToCurrentScoreP1(roll);
					break;
				case TURN_P2:
					addToCurrentScoreP2(roll);
					break;
				default:
					console.log("Error Roll 2-6");
			}
		}
	}
}

function holdListener() {
	switch (active_player) {
		case TURN_P1:
			addToTotalScoreP1(current_score_p1);
			resetCurrentScoreP1();
			if (total_score_p1 >= SCORE_TO_WIN) {
				game_status = GAME_FINISHED;
				PLAYER2.classList.add("hidden");
			}
			break;
		case TURN_P2:
			addToTotalScoreP2(current_score_p2);
			resetCurrentScoreP2();
			if (total_score_p2 >= SCORE_TO_WIN) {
				game_status = GAME_FINISHED;
				PLAYER1.classList.add("hidden");
			}
			break;
		default:
			console.log("Error Hold");
	}
	if (game_status === GAME_RUNNING) switchTurn();
}

function newGameListener() {
	resetCurrentScoreP1();
	resetCurrentScoreP2();
	resetTotalScoreP1();
	resetTotalScoreP2();
	DICE.classList.add("hidden");
	PLAYER1.classList.remove("hidden");
	PLAYER2.classList.remove("hidden");
	game_status = GAME_RUNNING;
	if (active_player === TURN_P2) switchTurn();
}

// MAIN

BUTTON_ROLL.addEventListener("click", rollListener);
BUTTON_HOLD.addEventListener("click", holdListener);
BUTTON_NEW.addEventListener("click", newGameListener);
