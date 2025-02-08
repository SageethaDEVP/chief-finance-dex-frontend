import {getBars,resolveSymbol} from "./apis.js"


const supportedResolutions = ["1", "5", "15", "30", "60", "240", "1D","1W","1M"]
const configurationData = {
};
const config = {
	supports_marks: false,
	supports_timescale_marks: false,
	supports_time: true,
	supported_resolutions:supportedResolutions
}; 


//const globalRealtimeUpdator={};

// const updateLastBar = async()=>{
// 	if(globalRealtimeUpdator.symbolInfo){
// 		const bar = await getLastBar(globalRealtimeUpdator.symbolInfo.name,globalRealtimeUpdator.resolution);		
// 		if(bar){
// 			globalRealtimeUpdator.onRealtimeCallback(bar);
// 		}
			
// 	}
// 	setTimeout(updateLastBar,2000);
// }
// updateLastBar();
export default {
	onReady: cb => {
		setTimeout(() => cb(config), 0)
	},
	resolveSymbol:resolveSymbol,
	getBars:getBars,
	searchSymbols:()=>{},
	subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
		
		// globalRealtimeUpdator.onRealtimeCallback = onRealtimeCallback;
		// globalRealtimeUpdator.symbolInfo = symbolInfo;
		// globalRealtimeUpdator.resolution = resolution;
		
	},
	unsubscribeBars: subscriberUID => {
	},
	calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
		
		return resolution < 60 ? {resolutionBack: 'D', intervalBack: '1'} : undefined
	},
	getTimeScaleMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
		//optional
		
	},
	getServerTime: cb => {
	}
}
