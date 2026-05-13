import { notFound } from "next/navigation";
import { getPublicTable } from "../_components/table-data";

import { CheckoutView } from "./checkout-view";

export const metadata = {
  title: "Checkout",
};

type CheckoutPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { id } = await params;
  const table = await getPublicTable(id);

  if (!table) {
    notFound();
  }

  return <CheckoutView tableId={table.id} tableNumber={table.number} />;
}
