import chalk, { type ChalkInstance } from "chalk";
import figlet from "figlet";

export function pf(txt: string, format: ChalkInstance = chalk.reset) { console.log(format(figlet.textSync(txt))) }

export function clearToTitle() {
	process.stdout.cursorTo(0, 7);
	process.stdout.clearScreenDown();
}

