import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { fetchFoodDetail, formatPrice } from "../menu-data";
import { AddButton } from "./add-button";

type MenuDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function MenuDetailPage({ params }: MenuDetailPageProps) {
  const { slug } = await params;
  const food = await fetchFoodDetail(slug);

  if (!food) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background pb-28">
      <header className="border-b bg-background">
        <div className="mx-auto grid h-12 w-full max-w-3xl grid-cols-[2rem_1fr_2rem] items-center px-4 sm:px-6">
          <Button asChild variant="ghost" size="icon-sm">
            <Link href="/menu" aria-label="Kembali ke menu">
              <HugeiconsIcon icon={ArrowLeft01Icon} data-icon="inline-start" />
            </Link>
          </Button>

          <h1 className="truncate text-center text-base font-semibold">Detail Menu</h1>
          <span aria-hidden="true" />
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-3xl flex-col px-4 py-4 sm:px-6">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted sm:aspect-4/3">
          <Image src={food.thumbnail} alt={food.name} fill loading="eager" sizes="(max-width: 768px) 100vw, 768px" unoptimized className="object-cover" />
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">{food.category}</p>
          <h2 className="text-2xl font-semibold leading-tight">{food.name}</h2>
          <p className="text-sm text-muted-foreground">{formatPrice(food.price)}</p>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <h3 className="text-base font-semibold">Deskripsi</h3>
          <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">{food.description}</p>
        </div>

        <AddButton foodName={food.name} price={food.price} />
      </section>
    </main>
  );
}
