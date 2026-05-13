import { notFound } from "next/navigation";
import { getPublicTable } from "../_components/table-data";

import { CartView } from "./cart-view";

export const metadata = {
  title: "Keranjang",
};

type CartPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CartPage({ params }: CartPageProps) {
  const { id } = await params;
  const table = await getPublicTable(id);

  if (!table) {
    notFound();
  }

  return <CartView tableId={table.id} tableNumber={table.number} />;
}
