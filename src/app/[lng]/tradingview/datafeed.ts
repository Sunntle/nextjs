import { Bar, ErrorCallback, HistoryCallback, LibrarySymbolInfo, PeriodParams, ResolutionString, ResolveCallback, SymbolInfoPriceSource, SymbolResolveExtension } from "charting_library";
import {  generateSymbol, parseFullSymbol } from "./helper";
import { makeApiRequest } from "@/lib/api";
import { subscribeOnStream, unsubscribeFromStream } from "./streaming";

export interface ISymbol {
  symbol: string,
  full_name: string,
  description: string,
  exchange: string,
  type: "crypto",
}
interface UrlParameters {
  e: string;
  fsym: string;
  tsym: string;
  toTs: number;
  limit: number;
  [key: string]: string | number;
}
interface IBarCryptoCompare extends Bar{
  volumeto : number;
  volumefrom: number
}
// DatafeedConfiguration implementation
const configurationData = {
  // Represents the resolutions for bars supported by your datafeed
  supported_resolutions: ["1", "5", "15", "30", "60", "1D", "1W", "1M"],
  // The `exchanges` arguments are used for the `searchSymbols` method if a user selects the exchange
  exchanges: [
    { value: "Coinbase", name: "Coinbase", desc: "Coinbase  exchange" },

    { value: "Bitfinex", name: "Bitfinex", desc: "Bitfinex" },

    { value: "Kraken", name: "Kraken", desc: "Kraken bitcoin exchange" },
  ],
  // The `symbols_types` arguments are used for the `searchSymbols` method if a user selects this symbol type
  symbols_types: [
    { name: "crypto", value: "crypto" },
    { name: "stock", value: "stock" },
  ],
};

// Use it to keep a record of the most recent bar on the chart
const lastBarsCache = new Map();

// Obtains all symbols for all exchanges supported by CryptoCompare API
async function getAllSymbols(): Promise<ISymbol[]> {
  const data = await makeApiRequest("data/v2/all/exchanges");
  let allSymbols:ISymbol[] = [];

  for (const exchange of configurationData.exchanges) {
    const pairs = data.Data[exchange.value].pairs;

    for (const leftPairPart of Object.keys(pairs)) {
      const symbols = pairs[leftPairPart].map((rightPairPart:string) => {
        const symbol = generateSymbol(
          exchange.value,
          leftPairPart,
          rightPairPart
        );
        return {
          symbol: symbol.short,
          full_name: symbol.full,
          description: symbol.short,
          exchange: exchange.value,
          type: "crypto",
        };
      });
      allSymbols = [...allSymbols, ...symbols];
    }
  }
  return allSymbols;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  onReady: (callback: any) => {
    console.log("[onReady]: Method call");
    setTimeout(() => callback(configurationData));
  },

  searchSymbols: async (
    userInput: string,
    exchange: string,
    symbolType: string,
    onResultReadyCallback: any
  ) => {
    console.log("[searchSymbols]: Method call");
    const symbols = await getAllSymbols();

    const newSymbols = symbols.filter((symbol) => {
      const isExchangeValid = exchange === "" || symbol.exchange === exchange;
      const isFullSymbolContainsInput =
        symbol.full_name.toLowerCase().indexOf(userInput.toLowerCase()) !== -1;

      return isExchangeValid && isFullSymbolContainsInput;
    });
    console.log(newSymbols);
    onResultReadyCallback(newSymbols);
  },

  resolveSymbol: async (
    symbolName: string,
    onSymbolResolvedCallback: ResolveCallback,
    onResolveErrorCallback: ErrorCallback,
    extension: SymbolResolveExtension
  ) => {
    console.log("[resolveSymbol]: Method call", symbolName);
    const symbols = await getAllSymbols();
    const symbolItem = symbols.find(({ full_name }) => {
      return full_name.includes(symbolName);
    });
    if (!symbolItem) {
      console.log("[resolveSymbol]: Cannot resolve symbol", symbolName);
      onResolveErrorCallback("Cannot resolve symbol");
      return;
    }
    // Symbol information object
    const symbolInfo = {
      ticker: symbolItem.full_name,
      name: symbolItem.symbol,
      description: symbolItem.description,
      type: symbolItem.type,
      session: "24x7",
      timezone: "Etc/UTC",
      exchange: symbolItem.exchange,
      minmov: 1,
      pricescale: 100,
      has_intraday: true,
      visible_plots_set: "ohlc",
      has_weekly_and_monthly: true,
      supported_resolutions: configurationData.supported_resolutions,
      volume_precision: 2,
      data_status: "streaming",
    };
    console.log("[resolveSymbol]: Symbol resolved", symbolName);
    onSymbolResolvedCallback(symbolInfo as LibrarySymbolInfo);
  },

  getBars: async (
    symbolInfo: ISymbol,
    resolution: ResolutionString,
    periodParams: PeriodParams,
    onHistoryCallback: HistoryCallback,
    onErrorCallback: ErrorCallback
  ) => {
    const { from, to, firstDataRequest } = periodParams;
    const parsedSymbol = parseFullSymbol(symbolInfo.full_name);
    if(!parsedSymbol) {
      onHistoryCallback([], { noData: true });
      return;
    }
    const urlParameters: UrlParameters = {
      e: parsedSymbol.exchange,
      fsym: parsedSymbol.fromSymbol,
      tsym: parsedSymbol.toSymbol,
      toTs: to,
      limit: 2000,
    };
    const query = Object.keys(urlParameters)
    .map((name) => `${name}=${encodeURIComponent(urlParameters[name])}`)
    .join("&");
    try {
      console.log("Resolution", resolution);
      const fullQuery =
        resolution.includes("D") ||
        resolution.includes("W") ||
        resolution.includes("M")
          ? `data/histoday?${query}`
          : +resolution < 60
          ? `data/histominute?${query}`
          : `data/histohour?${query}`;
      const data = await makeApiRequest(fullQuery);
      if (
        (data.Response && data.Response === "Error") ||
        data.Data.length === 0
      ) {
        // "noData" should be set if there is no data in the requested period
        onHistoryCallback([], { noData: true });
        return;
      }
      let bars: Bar[] = [];

      data.Data.forEach((bar: IBarCryptoCompare) => {
        if (bar.time >= from && bar.time < to) {
          bars = [
            ...bars,
            {
              time: bar.time * 1000,
              low: bar.low,
              high: bar.high,
              open: bar.open,
              close: bar.close,
              volume: bar.volumeto - bar.volumefrom,
            },
          ];
        }
      });
      if (firstDataRequest) {
        lastBarsCache.set(symbolInfo.full_name, { ...bars[bars.length - 1] });
      }
      console.log(`[getBars]: returned ${bars.length} bar(s)`);
      onHistoryCallback(bars, { noData: false });
    } catch (error: any) {
      console.log("[getBars]: Get error", error);
      onErrorCallback(error);
    }
  },

  subscribeBars: (
    symbolInfo: ISymbol,
    resolution: ResolutionString,
    onRealtimeCallback: any,
    subscriberUID: string,
    onResetCacheNeededCallback: any
  ) => {
    console.log(
      "[subscribeBars]: Method call with subscriberUID:",
      subscriberUID
    );
    subscribeOnStream(
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscriberUID,
      onResetCacheNeededCallback,
      lastBarsCache.get(symbolInfo.full_name)
    );
  },

  unsubscribeBars: (subscriberUID:string) => {
    console.log(
      "[unsubscribeBars]: Method call with subscriberUID:",
      subscriberUID
    );
    unsubscribeFromStream(subscriberUID);
  },
};
