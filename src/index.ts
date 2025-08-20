import { SlippiGame } from '@slippi/slippi-js';
import chokidar from 'chokidar';
import { getRequestedStats } from './parser';
import chalk from 'chalk';
import { pf, clearToTitle, toHumanReadable, getPlayerIndex, getOpponentName } from './utils';
import { argv, config } from './helpers';

console.clear();
pf("Slippi Postgame", chalk.green);
console.info('\n', 'Listening at:', argv.replayPath)
const games: SlippiGame[] = [];


chokidar
	.watch(argv.replayPath,)
	.on('change', (filepath) => {
		const game = new SlippiGame(filepath);

		if (game.getGameEnd()) {
			const metadata = game.getMetadata();
			const playerIndex = getPlayerIndex(config.tags, metadata?.players);
			const requestedStats = getRequestedStats(game.getStats()!, config.stats, playerIndex);

			games.push(game);
			clearToTitle();
			console.log(`Game ${games.length}`)
			console.log(`Versus: ${getOpponentName(playerIndex, metadata!.players)}\n`)
			console.log(chalk.bold(toHumanReadable(requestedStats)));
		}
	})

