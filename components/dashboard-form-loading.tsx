import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardFormLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader className="gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
        <CardFooter className="justify-between gap-2 pt-5">
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-7 w-28" />
        </CardFooter>
      </Card>
    </div>
  );
}
