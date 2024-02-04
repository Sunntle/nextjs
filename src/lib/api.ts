import { IError, INewToken, IResponseNewToken, IResponseToplist } from "@/types/types";
import { ALLOWED_VALUES_SORT_BY } from "@/utils/constant";

interface INewTokenProps {
  page: number;
  page_size: number;
  sort_by: string;
  sort_direction: "DESC" | "ASC";
  [key:string]: string | number;
}
const URL_DATA = process.env.URL_CRYPTO_COMPARE_DATA
const URL = process.env.URL_CRYPTO_COMPARE;
async function makeApiRequest(path: string) {
  try {
    const response = await fetch(`${URL}/${path}`);
    return response.json();
  } catch (error: any) {
    throw new Error(`CryptoCompare request error: ${error.status}`);
  }
}
async function getToplist(limit: number = 10, sym: string[] = ["USD"]) {
  const generateSym = sym.join(",");
  try {
    const response = await fetch(
      `${URL}/data/top/totaltoptiervolfull?limit=${limit}&tsym=${generateSym}`,
      { next: { revalidate: 120 } }
    );
    const data: IResponseToplist = await response.json();
    if (data.Message !== "Success") {
      console.log("Error", data);
    }
    return { count: data.MetaData.Count, data: data.Data };
  } catch (error: any) {
    throw new Error(`CryptoCompare request error: ${error.status}`);
  }
}
//https://data-api.cryptocompare.com/asset/v1/top/list?page=1&page_size=10&sort_by=CREATED_ON&sort_direction=DESC

async function getDataByAssetType(props: INewTokenProps): Promise<INewToken>{
  const { sort_by } = props;
  try {
  if(!ALLOWED_VALUES_SORT_BY.includes(sort_by)) throw Error(`sort_by is invalid. It is not one of the allowed values. Please make sure the string provided in sort_by is one of the following values: ${ALLOWED_VALUES_SORT_BY.join(",")}`)
  const query = Object.keys(props)
    .map((name) => `${name}=${encodeURIComponent(props[name as keyof typeof props])}`)
    .join("&");

    const response = await fetch(`${URL_DATA}/asset/v1/top/list?${query}`, {
      next: { revalidate: 300 },
    });
    const data:IResponseNewToken = await response.json();
    if(Object.keys(data.Err).length !== 0) throw Error(`Some thing went wrong: ${data.Err.message}`)
    return { count: data.Data.STATS.TOTAL_ASSETS, page: data.Data.STATS.PAGE, page_size:data.Data.STATS.TOTAL_SIZE, data: data.Data.LIST };
  } catch (error: any) {
    throw new Error(`CryptoCompare request error: ${error.status}`);
  }
}

export { makeApiRequest, getToplist, getDataByAssetType };
