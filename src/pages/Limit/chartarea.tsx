import * as React from 'react';
import {useRef,useEffect,useState} from 'react';

import styled from 'styled-components';
import {
	widget,
	LanguageCode,
	ResolutionString
} from '../../charting_library';
import datafeed from './api/index';


const ChartWrapper = styled.div`
	margin-top:10px;
    position: relative;
    flex : 1 0 auto;
    width:100%;
  `;


export default function ChartArea({
	symbol,
	fullscreen
}:any) {
	const chartContainerRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
	const [tvWidget,setTvWidget] = useState<any>(null);
	useEffect(()=>{
		if(symbol!="" && tvWidget!==null){
			try{
				tvWidget.headerReady().then(()=>{
					tvWidget.setSymbol(symbol,60,null);	
				})

			}catch(e){

			}
		}
	},[symbol,tvWidget])

	useEffect(() => {
		const tvWidget = new widget({
			symbol: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2:0xdAC17F958D2ee523a2206206994597C13D831ec7:ETH:USDT",
			datafeed: datafeed,
			interval: '60' as ResolutionString,
			container: chartContainerRef.current,
			library_path: '/charting_library/',
			locale: 'en' as LanguageCode,
			disabled_features: [
			'use_localstorage_for_settings',
			'header_symbol_search',
			'header_compare',
			'header_saveload',
			'volume_force_overlay'
			],
			enabled_features: [],

			charts_storage_url: 'https://saveload.tradingview.com',
			charts_storage_api_version: '1.1',
			client_id: 'tradingview.com',
			user_id: 'public_user_id',
			fullscreen: fullscreen,
			autosize: true,
			studies_overrides: {},
		});
		setTvWidget(tvWidget);
	
		return () => {
			tvWidget?.remove();
		};
	},[]);

	return (
			<ChartWrapper 
				ref={ chartContainerRef }
				className={ 'TVChartContainer' }
			>
			</ChartWrapper>

		)
}

