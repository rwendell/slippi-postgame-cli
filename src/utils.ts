import chalk, { type ChalkInstance } from "chalk";
import figlet from "figlet";

export const DEFAULT_CONFIG_PATH = `${process.env.HOME}/.config/slippi-postgame/config.json`

export function pf(txt: string, format: ChalkInstance = chalk.reset) { console.log(format(figlet.textSync(txt))) }


export function clearToTitle() {
	process.stdout.cursorTo(0, 7);
	process.stdout.clearScreenDown();
}

export async function createHomeConfig() {
	console.info(`creating config file at ${DEFAULT_CONFIG_PATH}`);
	const defaultConfig = await fetch("https://raw.githubusercontent.com/rwendell/slippi-postgame-cli/refs/heads/main/default-config.json");
	Bun.write(DEFAULT_CONFIG_PATH, defaultConfig);
	return Bun.file(DEFAULT_CONFIG_PATH);
}
