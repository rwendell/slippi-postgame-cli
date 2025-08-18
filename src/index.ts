import { SlippiGame } from '@slippi/slippi-js';
import chokidar from 'chokidar';
import { getRequestedStats, type RecurseConfig } from './parser';
import chalk from 'chalk';
import { pf, clearToTitle } from './utils';
import { argv, config } from './helpers';

console.clear();
pf("Slippi Postgame", chalk.green);
console.info('\n', 'Listening at:', argv.replayPath)

chokidar
	.watch(argv.replayPath,)
	.on('change', (filepath) => {
		const game = new SlippiGame(filepath);
		if (game.getGameEnd()) {
			clearToTitle();
			console.log(getRequestedStats(game, config.stats as unknown as RecurseConfig, config.tags))
		}
	})


