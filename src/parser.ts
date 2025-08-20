import { type StatsType } from "@slippi/slippi-js";
import type { ConfigStatsType } from "../types/ConfigType";

export type RecurseConfig = {
	[key: string]: boolean | RecurseConfig;
};
type RecurseData = Record<string, any>;
export type RequestedStatsOutput = Record<string, any>;

export function getRequestedStats(
	stats: StatsType,
	requestedStats: RecurseConfig | ConfigStatsType,
	playerIndex: number
): RequestedStatsOutput {
	const result = {};
	console.log(playerIndex);

	function _recurseAndProcess(
		config: RecurseConfig,
		stats: RecurseData | ConfigStatsType,
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

	_recurseAndProcess(requestedStats, stats, result);
	return result;
}
