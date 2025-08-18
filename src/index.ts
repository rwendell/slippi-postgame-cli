import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { SlippiGame } from '@slippi/slippi-js';
import type { ConfigType } from '../types/ConfigType';
import chokidar from 'chokidar';
import { getRequestedStats, type RecurseConfig } from './parser';
import { clearToTitle, createHomeConfig, DEFAULT_CONFIG_PATH, pf } from './utils';
import chalk from 'chalk';


const argv = yargs(hideBin(process.argv))
	.version(false)
	.config({ logLevel: 'verbose' })
	.alias('h', 'help')
	.option(
		'replay-path',
		{
			alias: 'p',
			describe: 'the path to your Slippi replays',
			type: 'string',
			default: process.env.HOME + '/Slippi'
		}
	)
	.option(
		'config',
		{
			alias: 'c',
			describe: 'provide a custom config file',
			type: 'string',
			default: DEFAULT_CONFIG_PATH
		}
	)
	.parseSync();


const config: ConfigType = await (Bun.file(argv.config).exists()) ? await Bun.file(argv.config).json() : (await createHomeConfig()).json;

pf("Slippi Postgame", chalk.green);
console.info('\n', 'Listening at:', argv.replayPath)

chokidar
	.watch(argv.replayPath, { ignored: (path, stats) => (stats?.isFile() ?? false) && !path.endsWith('.slp') })
	.on('change', (filepath) => {
		const game = new SlippiGame(filepath);
		if (game.getGameEnd()) {
			clearToTitle();
			console.log(getRequestedStats(game, config.stats as unknown as RecurseConfig, config.tags))
		}
	})


