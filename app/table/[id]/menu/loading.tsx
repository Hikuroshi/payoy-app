import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-svh w-full max-w-5xl flex-col bg-background px-4 pb-28 pt-4 sm:px-5 md:px-6">
        <header className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-5 w-16" />
        </header>

        <section className="mt-5">
          <Skeleton className="h-7 w-40" />
          <div className="mt-3.5 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card className="overflow-hidden p-0" key={index}>
                <CardContent className="grid grid-cols-[72px_1fr] gap-3 p-2.5 sm:grid-cols-[84px_1fr]">
                  <Skeleton className="aspect-square rounded-md" />
                  <div className="flex min-w-0 flex-col justify-center gap-2">
                    <Skeleton className="h-4 w-32 max-w-full" />
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-36 max-w-full" />
                    <Skeleton className="h-7 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
