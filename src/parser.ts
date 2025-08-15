import { SlippiGame, type MetadataType } from "@slippi/slippi-js";

export type RecurseConfig = {
	[key: string]: boolean | RecurseConfig;
};
type RecurseData = Record<string, any>;
type RequestedStatsOutput = Record<string, any>;

function getPlayerIndex(tags: Array<string>, players: MetadataType["players"]) { return tags.includes(players![0]!.names!.code!) ? 0 : 1 }

export function getRequestedStats(
	game: SlippiGame,
	requestedStats: RecurseConfig,
	playerTags: Array<string>
): RequestedStatsOutput {
	const result = {};
	const playerIndex = getPlayerIndex(playerTags, game.getMetadata()?.players);

	function _recurseAndProcess(
		config: RecurseConfig,
		stats: RecurseData,
		resultNode: RequestedStatsOutput
	) {
		Object.entries(config).forEach(([key, configValue]) => {
			const dataValue = stats[key];
			if (configValue === true) {
				resultNode[key] = dataValue;
				return;
			}

			if (typeof configValue !== 'object') { return }

			const newResultNode = {};
			resultNode[key] = newResultNode;
			const nextData = Array.isArray(dataValue) ? dataValue[playerIndex] : dataValue;

			_recurseAndProcess(configValue, nextData, newResultNode);

			if (Object.keys(newResultNode).length === 0) { delete resultNode[key]; }
		});
	}

	_recurseAndProcess(requestedStats, game.getStats()!, result);
	return result;
}
