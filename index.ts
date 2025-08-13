#!/usr/bin/env bun

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Define the CLI application with multiple commands.
yargs(hideBin(process.argv))
	.config({
		extends: [
			'config.json',
			process.env.HOME + '/.config/slippi-postgame/config.json'
		]
	})
	.version(false)
	.option(
		'replay-path',
		{
			alias: 'p',
			describe: 'the path to your Slippi replays',
			type: 'string',
			default: process.env.HOME + '/Slippi/'
		}
	)
	.parse();
