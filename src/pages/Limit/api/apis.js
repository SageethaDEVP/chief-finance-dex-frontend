import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import {bitquery_key} from '../../../constants';

const endpoint = 'https://graphql.bitquery.io';



const GET_COIN_BARS =(from,to,ticker,quote,interval)=> `
{
  ethereum(network: ethereum) {
    dexTrades(
      options: {asc: "timeInterval.minute"}
      date: {since: "${from}", till: "${to}"}

      exchangeName: {is: "Uniswap"}
      baseCurrency: {is: "${ticker}"}
      quoteCurrency: {is: "${quote}"}
      tradeAmountUsd: {gt: 10}
    ) {
      timeInterval {
        minute(count: ${interval})
      }
      baseCurrency {
        symbol
        address
      }
      baseAmount
      quoteCurrency {
        symbol
        address
      }
      quoteAmount
      trades: count
      quotePrice
      high: quotePrice(calculate: maximum)
      low: quotePrice(calculate: minimum)
      open: minimum(of: block, get: quote_price)
      close: maximum(of: block, get: quote_price)
    }
  }
}

`; 

const GET_LAST_PRICE = (selltoken,buytoken,since,till)=>`
{
      ethereum(network: ethereum) {
        dexTrades(
          options: {desc: ["trades"], limit: 2, limitBy: {each: "sellCurrency.address", limit: 1}, offset: 0}
          time: {since: "${since}", till: "${till}"}
          sellCurrency: {in: ["${selltoken}"]}
          buyCurrency: {in: ["${buytoken}"]}
        ) {
          trades: count
          exchange {
            fullName
          }
          sellCurrency {
            address
            symbol
          }
          buyCurrency {
            address
            symbol
          }
          ago24h_price: minimum(of: time, get: price)
          close_price: maximum(of: time, get: price)
        }
      }
}

`; 


const intervals = {
    '1': '1',
    '5': '5',
    '15': '15',
    '30': '30',
    '60': '60',
    '240': '240',
    'D': '1440',
    '1D': '1440',
}

const configurationData = {
    supported_resolutions: ['1','5','15','30', '60','240','1D']
};

const get_market_price = async(buytoken,selltoken)=>{
    
    const _dt_now = Date.now()
    const _dt_24h = _dt_now-24*3600*1000;
    const dt_now = (new Date(_dt_now)).toISOString();
    const dt_24h = (new Date(_dt_24h)).toISOString();

    const query = GET_LAST_PRICE(buytoken,selltoken,dt_24h,dt_now);
    let ago24h_price,close_price
    
    try{
        const response2 = await axios.post(endpoint, 
            {
                query,
            },
            {   
                mode:'cors',
                headers: {
                "Content-Type": "application/json",
                "X-API-KEY": bitquery_key
                }
            }
        )
        
        ago24h_price  = Number(response2.data.data.ethereum.dexTrades[0].ago24h_price);
        close_price  = Number(response2.data.data.ethereum.dexTrades[0].close_price);
    }catch(e){
        console.log('get market price',e);
    }
    return {ago24h_price,close_price}
}

const getSymbols = () => {return []};

const resolveSymbol = (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {

        if(!symbolName || symbolName=="ETHUSDT") {
            return onResolveErrorCallback('[resolveSymbol]: symbol not found');
        }
        const addresses = symbolName.split(":");
        
        const address1 = addresses[0];
        const address2 = addresses[1];
        const name1 = addresses[2];
        const name2 = addresses[3];
        
        const symbolInfo ={
            name: name1+"-"+name2,
            description: name1+"-"+name2,
            ticker: address1,
            session: '24x7',
            minmov: 1,
            pricescale: 1000000,
            timezone: 'UTC',
            has_intraday: true,
            has_daily: true,
            has_weekly_and_monthly: true,
            currency_code: address2
        }
            
        return onSymbolResolvedCallback(symbolInfo) 

    }

const getBars = async (symbolInfo, interval, periodParams, onHistoryCallback, onErrorCallback) => {
        
try{
        const {firstDataRequest,from,to}=periodParams;

        if(!firstDataRequest){
            onHistoryCallback([], {noData: true});    
        }
        const fromDate = (new Date(from*1000)).toISOString();
        const toDate = (new Date(to*1000)).toISOString();
        const ticker = symbolInfo.ticker;
        const quote = symbolInfo.currency_code;
        const _interval = intervals[interval]

        const query = GET_COIN_BARS(fromDate,toDate,ticker,quote,_interval);
        
        try{
            const response2 = await axios.post(endpoint, 
                {
                    query,
                },
                {   
                    mode:'cors',
                    headers: {
                    "Content-Type": "application/json",
                    "X-API-KEY": bitquery_key
                    }
                }
            )

            const bars = response2.data.data.ethereum.dexTrades.map(el => ({
                time: new Date(el.timeInterval.minute).getTime(), // date string in api response
                low: el.low,
                high: el.high,
                open: Number(el.open),
                close: Number(el.close),
                volume: el.quoteAmount
            }))

            if (bars.length){
                onHistoryCallback(bars, {noData: false}); 
            }else{
                onHistoryCallback([], {noData: true}); 
            }

        }catch(e){
            onHistoryCallback([], {noData: true}); 
        }
    
    } catch(err){
        console.log({err})
        // onErrorCallback(err)
    }
}
export { getBars,resolveSymbol,get_market_price}
