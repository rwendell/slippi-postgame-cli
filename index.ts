#!/usr/bin/env bun
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { watch } from 'node:fs';
import { SlippiGame, type MetadataType, type StatsType } from '@slippi/slippi-js';
import type { ConfigType } from './types/ConfigType';

const homeConfig = `${process.env.HOME}/.config/slippi-postgame/config.json`;
const argv = yargs(hideBin(process.argv))
	.version(false)
	.config({ logLevel: 'verbose' })
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
	console.log(event, filename);
	if (event !== "change" || !filename!.endsWith('.slp')) return;

	const game = new SlippiGame(filename!);

	if (game.getGameEnd()) {
		const requestedStats = filterPlayerStatsByConfig(game.getStats()!, config, getPlayerIndex(config.tag, game.getMetadata()?.players));
		console.log(requestedStats);
	}
})


function getPlayerIndex(tags: string[], players: MetadataType["players"]) {
	return tags.includes(players![0]!.names!.code!) ? 0 : 1;
}

function filterPlayerStatsByConfig(stats: StatsType, config: ConfigType, playerIndex: 0 | 1) {
	//TODO:
	const filteredStats = {};
	return filteredStats;
}
