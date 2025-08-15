export interface ConfigType {
	replayFolder: string,
	tags: string[],
	stats: ConfigStatsType
}

export interface ConfigStatsType {

	overall: {
		successfulConversions: boolean,
		inputsPerMinute: boolean,
		digitalInputsPerMinute: boolean,
		openingsPerKill: boolean,
		damagePerOpening: boolean,
		neutralWinRatio: boolean,
		counterHitRatio: boolean,
		beneficialTradeRatio: boolean,
	}
	actionCounts: {
		wavedashCount: boolean,
		wavelandCount: boolean,
		airDodgeCount: boolean,
		dashDanceCount: boolean,
		spotDodgeCount: boolean,
		ledgegrabCount: boolean,
		rollCount: boolean,
		lCancelCount: {
			success: boolean,
			fail: boolean
		},
		grabCount: {
			success: boolean,
			fail: boolean
		},
		throwCount: {
			up: boolean,
			forward: boolean,
			back: boolean,
			down: boolean
		},
		groundTechCount: {
			away: boolean,
			in: boolean,
			neutral: boolean,
			fail: boolean
		},
		wallTechCount: {
			success: boolean,
			fail: boolean
		}
	}

}
