#!/usr/bin/env bun
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { SlippiGame } from '@slippi/slippi-js';
import type { ConfigType } from '../types/ConfigType';
import chokidar from 'chokidar';
import { getRequestedStats, type RecurseConfig } from './parser';

const homeConfig = `${process.env.HOME}/.config/slippi-postgame/config.json`
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
			default: homeConfig
		}
	)
	.parseSync();


const config: ConfigType = await (Bun.file(argv.config).exists())
	? await Bun.file(argv.config).json()
	: (await createHomeConfig()).json;

console.log('listening recursively at:', argv.replayPath)
chokidar
	.watch(argv.replayPath, { ignored: (path, stats) => (stats?.isFile() ?? false) && !path.endsWith('.slp') })
	.on('change', (filepath) => {
		const game = new SlippiGame(filepath);
		if (game.getGameEnd()) {
			console.clear();
			console.log(getRequestedStats(game, config.stats as unknown as RecurseConfig, config.tags))
		}
	})



async function createHomeConfig() {
	console.info(`creating config file at ${homeConfig}`);
	const config = await fetch("https://raw.githubusercontent.com/rwendell/slippi-postgame-cli/refs/heads/main/default-config.json");
	Bun.write(homeConfig, config);
	return Bun.file(homeConfig);
}
