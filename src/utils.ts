import type { MetadataType } from "@slippi/slippi-js";
import chalk, { type ChalkInstance } from "chalk";
import figlet from "figlet";

export function pf(txt: string, format: ChalkInstance = chalk.reset) { console.log(format(figlet.textSync(txt, 'DOS Rebel'))) }

export function getPlayerIndex(tags: Array<string>, players: MetadataType["players"]) { return Object.values(players!).findIndex(player => tags.map(tag => tag.toUpperCase()).includes(player?.names?.code as string)) }

export function getOpponentName(playerIndex: number, players: MetadataType["players"]) { return Object.values(players!).find((_player, index) => index !== playerIndex)?.names?.netplay }

export function clearToTitle() {
	process.stdout.cursorTo(0, 12);
	process.stdout.clearScreenDown();
}

function flatten(obj: any): { [key: string]: any } {
	const result: { [key: string]: any } = {};

	function _flatten(current: any, parentKey: string = ''): void {
		for (const key in current) {
			const newKey = parentKey ? `${parentKey}.${key}` : key;
			const value = current[key];

			typeof value === 'object'
				? _flatten(value, newKey)
				: result[newKey] = value;

		}
	}

	_flatten(obj);
	return result;
}

export function toHumanReadable(data: any): string {
	function _formatKey(key: string): string {
		return key
			.replace(/Count$/, '')
			.replace(/([a-z])([A-Z])/g, '$1-$2')
			.toLowerCase();
	};
	const flattened = {};

	Object.keys(data).forEach(k => Object.assign(flattened, flatten(data[k])));

	let output = "";
	Object.entries(flattened).forEach(([key, value]) => {
		const parts = key.split(".");
		const [mainKey, status] = parts;
		const isStatusKey = parts.length === 2;
		const formattedKey = _formatKey(isStatusKey ? mainKey! : key);

		const humanReadableKey = isStatusKey
			? `${status === 'success' ? chalk.green('Successful') : chalk.red('Failed')} ${formattedKey}`
			: formattedKey[0]?.toUpperCase() + formattedKey.substring(1);

		output += `${humanReadableKey}: ${value}\n`;
	});

	return output.trim();
}
