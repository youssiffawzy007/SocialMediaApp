import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
export default function PostSkeleton() {
  return (
    <div className="bg-white p-4 rounded-xl shadow mb-4 w-full">
      <div className="flex items-center gap-3 mb-3">
        <Skeleton circle width={50} height={50} />
        <div className="flex-1">
          <Skeleton height={12} width="60%" />
          <Skeleton height={10} width="40%" />
        </div>
      </div>

      <Skeleton height={12} className="mb-2" />
      <Skeleton height={12} className="mb-2" />
      <Skeleton height={12} width="80%" />
    </div>
  );
}
