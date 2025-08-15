#!/usr/bin/env bun
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { watch } from 'node:fs';
import { SlippiGame } from '@slippi/slippi-js';
import type { ConfigType } from '../types/ConfigType';
import { getRequestedStats, type RecurseConfig } from './parser';

const homeConfig = `${process.env.HOME}/.config/slippi-postgame/config.json`;
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
			default: process.env.HOME + '/Slippi/'
		}
	)
	.option(
		'config',
		{
			alias: 'c',
			describe: 'provide a custom config file',
			type: 'string',
			default: async () => await Bun.file(homeConfig).exists() ? homeConfig : 'default-config.json'
		}
	)
	.parseSync();

const config: ConfigType = await Bun.file(await argv.config).json();

console.log('listening recursively at:', argv.replayPath)
watch(argv.replayPath, { recursive: true }, (event, filename) => {
	if (event !== "change" || !filename!.endsWith('.slp')) return;
	const game = new SlippiGame(filename!);

	if (game.getGameEnd()) {
		console.clear();
		console.table(getRequestedStats(game, config.stats as unknown as RecurseConfig, config.tags))
	}
})



