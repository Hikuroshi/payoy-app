import { notFound } from "next/navigation";
import { getPublicTable } from "../_components/table-data";

import { OrderStatusView } from "./order-status-view";

export const metadata = {
  title: "Status Pesanan",
};

type OrderStatusPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderStatusPage({ params }: OrderStatusPageProps) {
  const { id } = await params;
  const table = await getPublicTable(id);

  if (!table) {
    notFound();
  }

  return <OrderStatusView tableId={table.id} tableNumber={table.number} />;
}
