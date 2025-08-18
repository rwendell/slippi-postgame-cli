import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import type { ConfigType } from "../types/ConfigType";
import { DEFAULT_CONFIG_PATH } from "./constants";

export async function createHomeConfig() {
	console.info(`creating config file at ${DEFAULT_CONFIG_PATH}`);
	const defaultConfig = await fetch("https://raw.githubusercontent.com/rwendell/slippi-postgame-cli/refs/heads/main/default-config.json");
	Bun.write(DEFAULT_CONFIG_PATH, defaultConfig);
	return Bun.file(DEFAULT_CONFIG_PATH);
}

export const argv = yargs(hideBin(process.argv))
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

export const config: ConfigType = await (Bun.file(argv.config).exists()) ? await Bun.file(argv.config).json() : (await createHomeConfig()).json;
