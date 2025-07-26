import { Skeleton } from "@workspace/ui/components/skeleton";

const Loading = () => {
  return (
    <div className="flex gap-4 mt-24">
      <Skeleton className="w-full h-32" />
      <Skeleton className="w-full h-32" />
      <Skeleton className="w-full h-32" />
    </div>
  );
};

export default Loading;
