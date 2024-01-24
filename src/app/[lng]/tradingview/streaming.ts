"use client";
import { Bar, ResolutionString } from "charting_library";
import { ISymbol } from "./datafeed";
import { parseFullSymbol } from "./helper";

interface ISubscriptionItem {
  subscriberUID: string;
  lastDailyBar: Bar;
  resolution: ResolutionString;
  handlers: [{ id: string; callback: Function }];
}
const CRYPTO_COMPARE_API_KEY =`81ead87784ac9cc1e8450f923768be09afafc70c28725b4d59a4254fd7f5abeb`
let ccStreamer: WebSocket | undefined;

if (!ccStreamer) {
  ccStreamer = new WebSocket(
    "wss://streamer.cryptocompare.com/v2?api_key=" +
    CRYPTO_COMPARE_API_KEY
  );
}
const channelToSubscription = new Map<string, ISubscriptionItem>();

function getNextDailyBarTime(
  barTime: number,
  resolution: number | ResolutionString
): number {
  const time = !isNaN(resolution as number) ? +resolution : "";
  if (typeof time === "number") {
    // Nếu time là số và lớn hơn hoặc bằng 60 thì cộng thêm 1 giờ
    if (time >= 60) {
      return new Date(barTime).getTime() + 3600000;
    } else {
      // Nếu time là số và bé hơn 60 thì cộng thêm time phút
      return new Date(barTime).getTime() + time * 60000;
    }
  } else {
    // Nếu time là chuỗi thì cộng thêm 1 ngày
    return new Date(barTime).getTime() + 86400000;
  }
}

ccStreamer.onmessage = function onStreamMessage(message) {
  const data = JSON.parse(message.data);
  const { TYPE, FSYM, M, P, TSYM, RTS, TOTAL } = data;

  if (+TYPE !== 0) {
    // Skip all non-trading events
    return;
  }
  let channelString = `0~${M}~${FSYM}~${TSYM}`;
  const subscriptionItem = channelToSubscription.get(channelString);
  if (subscriptionItem === undefined) {
    return;
  }
  const lastDailyBar = subscriptionItem.lastDailyBar;
  const nextDailyBarTime = getNextDailyBarTime(
    lastDailyBar.time,
    subscriptionItem.resolution
  );

  console.log("Thời gian nến cuối: ", lastDailyBar.time);
  console.log("Thời gian ước tính nến mới hình thành: ", nextDailyBarTime);
  let bar: Bar;
  const time = RTS * 1000;
  if (time >= nextDailyBarTime) {
    bar = {
      time: nextDailyBarTime,
      open: P,
      high: P,
      low: P,
      close: P,
      volume: TOTAL,
    };

    console.log("[socket] Generate new bar", bar);
  } else {
    bar = {
      ...lastDailyBar,
      high: Math.max(lastDailyBar.high, P),
      low: Math.min(lastDailyBar.low, P),
      close: P,
      volume: lastDailyBar.volume + TOTAL,
    };
    console.log("[socket] Update the latest bar by price", P);
  }
  subscriptionItem.lastDailyBar = bar;
  console.log("Gán thông tin mới nhận vào nến cuối", bar.time);
  console.log("subscriptionItem", subscriptionItem);

  subscriptionItem.handlers.forEach((handler) => {
    if (subscriptionItem.subscriberUID === handler.id) handler.callback(bar);
  });
};

ccStreamer.onerror = (error) => {
  console.error("WebSocket error:", error);
};
export function subscribeOnStream(
  symbolInfo: ISymbol,
  resolution: ResolutionString,
  onRealtimeCallback: any,
  subscriberUID: string,
  onResetCacheNeededCallback: any,
  lastDailyBar: Bar
) {
  const parsedSymbol = parseFullSymbol(symbolInfo.full_name);
  if (!parsedSymbol) return;
  const channelString = `0~${parsedSymbol.exchange}~${parsedSymbol.fromSymbol}~${parsedSymbol.toSymbol}`;
  const handler = {
    id: subscriberUID,
    callback: onRealtimeCallback,
  };
  let subscriptionItem = channelToSubscription.get(channelString);
  if (subscriptionItem) {
    // Already subscribed to the channel, use the existing subscription
    subscriptionItem.subscriberUID = subscriberUID;
    subscriptionItem.lastDailyBar = lastDailyBar;
    subscriptionItem.resolution = resolution;
    subscriptionItem.handlers.push(handler);
    return;
  }
  subscriptionItem = {
    subscriberUID,
    resolution,
    lastDailyBar,
    handlers: [handler],
  };

  channelToSubscription.set(channelString, subscriptionItem);
  console.log(
    "[subscribeBars]: Subscribe to streaming. Channel:",
    channelString
  );
  var subRequest = {
    action: "SubAdd",
    subs: [channelString],
  };
  if (!ccStreamer) throw new Error("Something went wrong with Socket");
  if (ccStreamer.readyState) {
    ccStreamer.send(JSON.stringify(subRequest));
  } else {
    console.log(ccStreamer);
  }
}

export function unsubscribeFromStream(subscriberUID: string) {
  // Find a subscription with id === subscriberUID
  for (const channelString of channelToSubscription.keys()) {
    const subscriptionItem = channelToSubscription.get(channelString);
    if (!subscriptionItem) break;
    const handlerIndex = subscriptionItem.handlers.findIndex(
      (handler) => handler.id === subscriberUID
    );

    if (handlerIndex !== -1) {
      // Remove from handlers
      subscriptionItem.handlers.splice(handlerIndex, 1);

      if (+subscriptionItem.handlers.length === 0) {
        // Unsubscribe from the channel if it is the last handler
        console.log(
          "[unsubscribeBars]: Unsubscribe from streaming. Channel:",
          channelString
        );
        var subRequest = {
          action: "SubRemove",
          subs: [channelString],
        };
        if (!ccStreamer) throw new Error("Something went wrong with Socket");
        ccStreamer.send(JSON.stringify(subRequest));
        channelToSubscription.delete(channelString);
        break;
      }
    }
  }
}
