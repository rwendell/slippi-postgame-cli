import { SlippiGame } from "@slippi/slippi-js";
import fs from "fs";
import path from "path";


const watcher = fs.watch(listenPath, {
	recursive: true
}, (eventType, filename) => {
	if (eventType !== "change" || !filename?.endsWith('.slp')) {
		return;
	}

	const fullPath = path.join(listenPath, filename);

	let gameState, settings, stats, frames, latestFrame, gameEnd;
	try {
		// The rest of the logic remains the same
		let game = gameByPath[fullPath]?.game;
		if (!game) {
			game = new SlippiGame(fullPath, { processOnTheFly: false });
			gameByPath[fullPath] = {
				game: game,
				state: {
					settings: null,
					detectedPunishes: {},
				},
			};
		}

		gameState = gameByPath[fullPath]?.state;
		settings = game.getSettings();
		stats = game.getStats();
		frames = game.getFrames();
		latestFrame = game.getLatestFrame();
		gameEnd = game.getGameEnd();
	} catch (err) {
		console.log(err);
		return;
	}

	if (!gameState.settings && settings) {
		console.log(`[Game Start] New game has started`);
		gameState.settings = settings;
	}

	if (gameEnd) {
		console.clear();

		const report = {};
		report.p1 = new Report(settings.players[0].displayName, stats.actionCounts[0].lCancelCount.fail, stats.actionCounts[0].groundTechCount.fail);
		report.p2 = new Report(settings.players[1].displayName, stats.actionCounts[1].lCancelCount.fail, stats.actionCounts[1].groundTechCount.fail);
		console.table(report);
	}
});

// An object to hold game state data for each file path
const gameByPath = {};

function Report(name, missed_lcancel, missed_tech) {
	this.name = name;
	this.missed_lcancel = missed_lcancel;
	this.missed_tech = missed_tech;
}

watcher.on('error', (error) => {
	console.error('File watcher error:', error);
});

console.log(`Now watching for changes in: ${listenPath}`);
