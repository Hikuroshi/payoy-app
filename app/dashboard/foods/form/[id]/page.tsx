import Link from "next/link";

import { StatusToast } from "@/components/status-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireOwnerProfile } from "@/lib/auth/profile";

import { updateFood } from "../../actions";
import { getOwnerFood } from "../../data";
import { FoodForm } from "../food-form";

type EditFoodPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParamValue(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = searchParams[key];
  return typeof value === "string" ? value : undefined;
}

function ErrorCard({ message }: { message: string }) {
  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Edit Makanan</CardTitle>
        <CardDescription>Makanan tidak bisa dimuat.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs/relaxed text-destructive">
          {message}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline">
          <Link href="/dashboard/foods">Kembali</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default async function EditFoodPage({
  params,
  searchParams,
}: EditFoodPageProps) {
  const owner = await requireOwnerProfile();
  const [{ id }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const error = getParamValue(resolvedSearchParams, "error");
  const { food, error: foodError } = await getOwnerFood(owner.id, id);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <StatusToast error={error} />
      {food ? (
        <FoodForm action={updateFood} food={food} mode="edit" />
      ) : (
        <ErrorCard message={foodError ?? "Makanan tidak ditemukan."} />
      )}
    </div>
  );
}
