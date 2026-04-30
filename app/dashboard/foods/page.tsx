import Link from "next/link";
import Image from "next/image";

import { StatusToast } from "@/components/status-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireOwnerProfile } from "@/lib/auth/profile";

import { getOwnerFoods, type Food } from "./data";
import { DeleteFoodDialog } from "./delete-food-dialog";

type FoodsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParamValue(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = searchParams[key];
  return typeof value === "string" ? value : undefined;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function getInitials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function FoodThumbnail({ food }: { food: Food }) {
  if (!food.imageUrl) {
    return (
      <div className="flex size-12 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
        {getInitials(food.name)}
      </div>
    );
  }

  return (
    <div className="relative size-12 overflow-hidden rounded-md border bg-muted">
      <Image
        alt={food.name}
        className="object-cover"
        fill
        sizes="48px"
        src={food.imageUrl}
        unoptimized
      />
    </div>
  );
}

function FoodsList({ foods }: { foods: Food[] }) {
  if (!foods.length) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-xs/relaxed text-muted-foreground">
        Belum ada makanan.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-44">Nama</TableHead>
          <TableHead className="min-w-44">Deskripsi</TableHead>
          <TableHead className="min-w-36">Harga</TableHead>
          <TableHead className="min-w-28">Status</TableHead>
          <TableHead className="w-40 text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {foods.map((food) => (
          <TableRow key={food.id}>
            <TableCell>
              <div className="flex min-w-44 items-center gap-3">
                <FoodThumbnail food={food} />
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="truncate font-medium">{food.name}</span>
                  <span className="text-[0.625rem] text-muted-foreground">
                    Dibuat{" "}
                    {new Date(food.createdAt).toLocaleDateString("id-ID")}
                  </span>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {food.description || "-"}
            </TableCell>
            <TableCell>{formatCurrency(food.price)}</TableCell>
            <TableCell>
              <Badge variant={food.isAvailable ? "secondary" : "outline"}>
                {food.isAvailable ? "Tersedia" : "Disembunyikan"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex justify-end gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/dashboard/foods/form/${food.id}`}>Edit</Link>
                </Button>
                <DeleteFoodDialog id={food.id} name={food.name} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default async function FoodsPage({ searchParams }: FoodsPageProps) {
  const owner = await requireOwnerProfile();
  const resolvedSearchParams = await searchParams;
  const success = getParamValue(resolvedSearchParams, "success");
  const error = getParamValue(resolvedSearchParams, "error");
  const { foods, error: foodsError } = await getOwnerFoods(owner.id);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <StatusToast error={error ?? foodsError} success={success} />
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-1">
            <CardTitle>Data Makanan</CardTitle>
            <CardDescription>
              Kelola {foods.length} makanan milik owner yang login.
            </CardDescription>
          </div>
          <CardAction>
            <Button asChild>
              <Link href="/dashboard/foods/form">Tambah makanan</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FoodsList foods={foods} />
        </CardContent>
      </Card>
    </div>
  );
}
