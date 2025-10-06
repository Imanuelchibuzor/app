import { Skeleton } from "@/components/ui/skeleton";

const SkeletonCard = () => {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[300px] w-[250px] md:h-[250px] md:w-[200px] lg:h-[300px] lg:w-[270px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 sm:w-[200px] md:w-[150px] lg:w-[200px]"/>
        <Skeleton className="h-4 sm:w-[200px] md:w-[150px] lg:w-[200px]"/>
        <Skeleton className="h-4 sm:w-[250px] md:w-[200px] lg:w-[270px]"/>
      </div>
    </div>
  );
};

export default SkeletonCard;
