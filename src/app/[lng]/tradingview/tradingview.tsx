"use client"
import { IBasicDataFeed, LanguageCode, TimeFrameItem, TradingTerminalWidgetOptions, widget } from "charting_library";
import { useEffect, useMemo, useRef } from "react";
import DataFeed from "./datafeed";
import {
  ChartingLibraryWidgetOptions,
  ResolutionString,
} from "public/static/charting_library/charting_library";

function getLanguageFromURL():LanguageCode {
  const regex = new RegExp("[\\?&]lang=([^&#]*)");
  const results = regex.exec(window.location.search);
  return results === null
    ? "vi"
    : decodeURIComponent(results[1].replace(/\+/g, " ")) as LanguageCode;
}

export const TVChartContainer = () => {
  const chartContainerRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const defaultProps:Partial<ChartingLibraryWidgetOptions> = useMemo(()=>({
    symbol: "BTC/USD",
    interval: "D" as ResolutionString,
    library_path: "static/charting_library/",
    charts_storage_url: "https://saveload.tradingview.com",
    charts_storage_api_version: "1.1",
    client_id: "tradingview.com",
    user_id: "public_user_id",
    fullscreen: true,
    autosize: true,
    studies_overrides: {  "volume.volume.plot.color.0": "#000000"}
  }),[]);
  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: defaultProps.symbol,
      datafeed: DataFeed as unknown as IBasicDataFeed,
      // new window.Datafeeds.UDFCompatibleDatafeed(defaultProps.datafeedUrl),
      interval: defaultProps.interval as ResolutionString,
      container: chartContainerRef.current,
      library_path: defaultProps.library_path,
      locale: getLanguageFromURL() || "vi" as LanguageCode,
      disabled_features: ["use_localstorage_for_settings"],
      enabled_features: [
        "create_volume_indicator_by_default"
      ],
      charts_storage_url: defaultProps.charts_storage_url,
      charts_storage_api_version: defaultProps.charts_storage_api_version,
      client_id: defaultProps.client_id,
      user_id: defaultProps.user_id,
      fullscreen: defaultProps.fullscreen,
      autosize: defaultProps.autosize,
      studies_overrides: defaultProps.studies_overrides,
      theme: "dark",
      timeframe: "3M",
      time_frames: [
        { text: "1y", resolution: "1D", description: "1 Year", title: "1y" } as TimeFrameItem,
        { text: "6m", resolution: "1D", description: "6 Months", title: "6m" } as TimeFrameItem,
        { text: "3m", resolution: "1D", description: "3 Months", title: "3m" } as TimeFrameItem,
        { text: "1m", resolution: "1M", description: "1 Month", title: "1m" } as TimeFrameItem,
        { text: "1d", resolution: "1D", description: "1 Day", title: "1d" } as TimeFrameItem,
        { text: "1m", resolution: "1", description: "1 Minute", title: "1" } as TimeFrameItem,
      ],
      timezone: "Asia/Ho_Chi_Minh",
      auto_save_delay: 5,
      toolbar_bg: "#000000",
      custom_formatters: {
        timeFormatter: {
          format: (date) => {
            const _format_str = '%h:%m';
            return _format_str
              .replace('%h', date.getUTCHours() as any)
              .replace('%m', date.getUTCMinutes() as any)
              .replace('%s', date.getUTCSeconds() as any);
          },
          formatLocal: function (date: Date): string {
            throw new Error("Function not implemented.");
          }
        },
        dateFormatter:  {
          format: function (date: Date): string {
            return (
              date.getUTCFullYear() +
              "-" +
              (date.getUTCMonth() + 1) +
              "-" +
              date.getUTCDate()
            );
          },
          formatLocal: function (date: Date): string {
            throw new Error("Function not implemented.");
          }
        },
      },
    }
    const tvWidget = new widget(widgetOptions as TradingTerminalWidgetOptions);
    tvWidget.onChartReady(() => {
      tvWidget.activeChart().createStudy('Volume', true, false);
      tvWidget.headerReady().then(() => {
        const button = tvWidget.createButton();
        button.setAttribute("title", "Click to show a notification popup");
        button.classList.add("apply-common-tooltip");
        button.addEventListener("click", () =>
          tvWidget.showNoticeDialog({
            title: "Notification",
            body: "TradingView Charting Library API works correctly",
            callback: () => {
              console.log("Noticed!");
            },
          })
        );
        button.innerHTML = "Check API";
      });
    });

    tvWidget.subscribe("onAutoSaveNeeded", () =>
      console.log("something change")
    );
    return () => {
      tvWidget.remove();
    };
  },[]);

  return <div ref={chartContainerRef} className={"TVChartContainer"} />;
};
