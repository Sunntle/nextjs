import { Button } from "@/components/ui/button";
import { CustomTabContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CardItem from "./card-items";
import { TFunction } from "i18next";
import {  INewToken, IToplist } from "@/types/types";
import { getDataByAssetType, getToplist } from "@/lib/api";
import CardSkeleton from "./card-skeleton";
import moment from "moment";
interface SectionListProps {
  lng: string;
  t: TFunction<string | any>;
  topList?: IToplist;
}
const SectionList = async ({ t, lng }: SectionListProps) => {
  const [topListNewToken, topList, topSpotMoving]: [INewToken, IToplist, INewToken] =
    await Promise.all([
      getDataByAssetType({
        page: 1,
        page_size: 10,
        sort_by: "CREATED_ON",
        sort_direction: "DESC",
      }),
      getToplist(6),
      getDataByAssetType({
        page: 1,
        page_size: 10,
        sort_by: "SPOT_MOVING_24_HOUR_CHANGE_PERCENTAGE_USD",
        sort_direction: "DESC",
      })
    ]);

  return (
    <section className="bg-welcome-image px-6 py-12 md:py-20 md:px-12">
      <div className="max-w-[1220px] mx-auto flex items-start justify-center gap-x-2 gap-y-5 xl:gap-5 md:flex-row flex-col">
        <div className=" md:basis-5/12 lg:basis-1/2">
          <h2 className="text-3xl font-semibold tracking-tight lg:text-5xl">
            {t("home.title2")}
          </h2>
          <h3 className="my-8 md:text-xl lg:text-3xl tracking-tight transition-colors first:mt-0">
            {t("home.subTitle2")}
          </h3>
          <Button type="submit" size="lg">
            See more
          </Button>
        </div>
        <Tabs
          defaultValue="tradable"
          className="basis-full w-full md:basis-7/12 lg:basis-1/2"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tradable">{t("home.tradable")}</TabsTrigger>
            <TabsTrigger value="top">{t("home.top")}</TabsTrigger>
            <TabsTrigger value="new">{t("home.new")}</TabsTrigger>
          </TabsList>
          <CustomTabContent
            value="tradable"
            className="grid w-full max-[380px]:grid-cols-1 gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-3"
          >
            {topList.data ? (
              topList.data.map((item, index) => {
                // const {DISPLAY: {"USD": {price}}, ...rest} = item
                // if(lng == "vi") price
                const {
                  CoinInfo: { FullName, Name, ImageUrl },
                  DISPLAY: {
                    USD: { PRICE, CHANGEPCT24HOUR },
                  },
                } = item;

                return (
                  <CardItem
                    className="basis-2/6"
                    key={index}
                    item={{
                      FullName,
                      name: Name,
                      img: ImageUrl,
                      price: PRICE,
                      percent: CHANGEPCT24HOUR,
                    }}
                    type="TRADABLE"
                  />
                );
              })
            ) : (
              <CardSkeleton />
            )}
          </CustomTabContent>
          <CustomTabContent value="top">
          {topSpotMoving?.data ?
              topSpotMoving?.data?.map((item, index) => {
                if (index > 5) return;
                return (
                  <CardItem
                    className="basis-2/6"
                    key={index}
                    item={{
                      img: item.LOGO_URL as string,
                      FullName: item.NAME as string,
                      price: item.PRICE_USD as string,
                      name: item.NAME as string,
                      percent: `${t("common.last-updated")}: ${ moment(new Date(item.PRICE_USD_LAST_UPDATE_TS as number * 1000)).format("DD/MM/YYYY").toString()}` 
                    }}
                    type="TOP"
                  />
                );
              }) : <CardSkeleton/>}
          </CustomTabContent>
          <CustomTabContent
            value="new"
          >
            {topListNewToken?.data ?
              topListNewToken?.data?.map((item, index) => {
                if (index > 5) return;
                return (
                  <CardItem
                    className="basis-2/6"
                    key={index}
                    item={{
                      img: item.LOGO_URL as string,
                      FullName: item.NAME as string,
                      price: moment(new Date(item.CREATED_ON as number * 1000)).format("hh:ss DD/MM/YYYY").toString(),
                      name: item.NAME as string,
                    }}
                    type="NEW"
                  />
                );
              }) : <CardSkeleton/>}
          </CustomTabContent>
        </Tabs>
      </div>
    </section>
  );
};

export default SectionList;
