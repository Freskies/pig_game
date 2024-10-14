"use strict";

const SCORE_TO_WIN = 40;

const PIG_GAME = {
	// true: game is running, false: game is finished
	isRunning: true,

	// dice
	pgDice: document.querySelector(".dice"),
	dice: undefined,
	generateRandomDiceValue: () => Math.trunc(Math.random() * 6) + 1,
	setDiceImg: function () {
		this.pgDice.src = `./img/dice-${this.dice}.png`;
	},
	rollDice: function () {
		this.dice = this.generateRandomDiceValue();
		this.setDiceImg();
	},

	// buttons
	pgNewGame: document.querySelector(".btn--new-game"),
	pgRollDice: document.querySelector(".btn--roll-dice"),
	pgHold: document.querySelector(".btn--hold"),

	createPlayer: name => {
		return {
			name: name,
			pgPlayer: document.querySelector(`.player--${name}`),
			pgCurrentScore: document.querySelector(`.current-score--${name}`),
			pgTotalScore: document.querySelector(`.total-score--${name}`),
			currentScore: undefined,
			totalScore: undefined,

			setCurrentScore: function () {
				this.pgCurrentScore.textContent = this.currentScore;
			},
			setTotalScore: function () {
				this.pgTotalScore.textContent = this.totalScore;
			},

			resetCurrentScore: function () {
				this.currentScore = 0;
				this.setCurrentScore();
			},
			addToCurrentScore: function (diceValue) {
				this.currentScore += diceValue;
				this.setCurrentScore();
			},
			holdInTotalScore: function () {
				this.totalScore += this.currentScore;
				this.setTotalScore();
				this.resetCurrentScore();
			},

			isWinScore: function () {
				return this.totalScore >= SCORE_TO_WIN;
			},
		};
	},

	createPlayers: function () {
		this.players = [this.createPlayer("p1"), this.createPlayer("p2")];
	},

	activePlayer: undefined,
	restingPlayer: undefined,

	setActivePlayer: function () {
		this.activePlayer.pgPlayer.classList.add("player--active");
		this.restingPlayer.pgPlayer.classList.remove("player--active");
	},

	switchTurn: function () {
		[this.activePlayer, this.restingPlayer] = [
			this.restingPlayer,
			this.activePlayer,
		];
		this.setActivePlayer();
	},

	startNewGame: function () {
		this.players.forEach(player => {
			player.currentScore = 0;
			player.totalScore = 0;
			player.pgPlayer.classList.remove("hidden");
			player.setCurrentScore();
			player.setTotalScore();
		});
		this.pgDice.classList.add("hidden");
		this.dice = undefined;
		this.isRunning = true;
		[this.activePlayer, this.restingPlayer] = this.players;
		this.setActivePlayer();
	},

	endGame: function () {
		this.isRunning = false;
		this.restingPlayer.pgPlayer.classList.add("hidden");
	},

	rollDiceListener: function (current_game) {
		console.log(current_game);
		if (current_game.isRunning) {
			if (current_game.pgDice.classList.contains("hidden"))
				current_game.pgDice.classList.remove("hidden");

			current_game.rollDice();

			if (current_game.dice === 1) {
				current_game.activePlayer.resetCurrentScore();
				current_game.switchTurn();
			} else current_game.activePlayer.addToCurrentScore(current_game.dice);
		}
	},

	holdListener: function (current_game) {
		console.log(current_game);
		if (current_game.isRunning) {
			current_game.activePlayer.holdInTotalScore();
			if (current_game.activePlayer.isWinScore()) current_game.endGame();
			else current_game.switchTurn();
		}
	},

	newGameListener: function (current_game) {
		console.log(current_game);
		current_game.startNewGame();
	},

	startPigGame: function () {
		this.createPlayers();
		this.startNewGame();

		const current_game = this;
		const rl = current_game.rollDiceListener;
		const hl = current_game.holdListener;
		const ng = current_game.newGameListener;

		this.pgRollDice.addEventListener("click", () => {
			rl(current_game);
		});
		this.pgHold.addEventListener("click", () => {
			hl(current_game);
		});
		this.pgNewGame.addEventListener("click", () => {
			ng(current_game);
		});
	},
};

PIG_GAME.startPigGame();
