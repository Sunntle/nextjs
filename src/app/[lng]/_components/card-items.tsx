import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { truncateString } from "@/utils/helper";
import { ArrowDownIcon, ArrowUpIcon, DotFilledIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useCallback } from "react";
interface CardItemProps {
    className: string,
    item: {img:string, FullName:string, name:string, price:string, percent?:string}
    type: "TRADABLE" | "NEW" | "TOP",
}

const CardItem = ({className, item, type }: CardItemProps) => {
    const handlePercentChange24h = useCallback((number:string)=>{
        if(!number) return
        if(+number > 0) return <div className="text-emerald-600 flex gap-x-2 items-center text-2xl font-semibold"><ArrowUpIcon className="w-[1.2rem] h-[1.2rem]"/>{number}</div>
        else if(+number < 0) return <div className="text-destructive flex gap-x-2 items-center text-2xl font-semibold"><ArrowDownIcon className="w-[1.2rem] h-[1.2rem] "/>{number}</div>
        else return <div className=" flex gap-x-2 items-center text-2xl font-semibold"><DotFilledIcon className="w-[1.2rem] h-[1.2rem]"/>{number}</div>
    }, [])
    
  return (
    <Card className={className}>
      <CardHeader>
        <div className="w-[45px] h-[45px]"><Image alt="image of coin" width={45} height={45} src={type !== "TRADABLE" ? item.img : `https://www.cryptocompare.com${item.img}`}/></div>
        <CardTitle className="text-md">{truncateString(item.FullName ?? item.name, 13)}</CardTitle>
        <CardDescription>{item.price}</CardDescription>
      </CardHeader>
      {type !== "NEW" &&<CardFooter>
        {type === "TRADABLE" ? item.percent && handlePercentChange24h(item.percent) : item.percent}
      </CardFooter>}
    </Card>
  );
};

export default CardItem;
