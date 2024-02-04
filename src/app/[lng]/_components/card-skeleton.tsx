import { Skeleton } from "@/components/ui/skeleton";

const CardSkeleton = () => {
    return <div className="h-full basis-2/6 space-y-2 p-4 flex flex-col items-start justify-center rounded-lg border bg-card text-card-foreground shadow-sm">
    <Skeleton className="w-[45px] h-[45px] rounded-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-10 w-full" />
  </div>;
}
 
export default CardSkeleton;