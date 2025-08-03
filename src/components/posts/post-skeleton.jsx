import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";

export function PostSkeleton() {
  return (
    <Card className="transition-shadow hover:shadow-md bg-card border-border">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-3/4 rounded-lg" />
            
        
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-4 w-20 rounded-md" />
          
          </div>

        </div>
      </CardContent>
    </Card>
  );
}

export function PostsListSkeleton({ count = 5 } ) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </div>
  );
} 