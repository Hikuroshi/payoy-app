import { notFound } from "next/navigation";
import { getPublicTable } from "../_components/table-data";

import { PaymentStatusView } from "./payment-status-view";

export const metadata = {
  title: "Status Pembayaran",
};

type PaymentStatusPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PaymentStatusPage({
  params,
}: PaymentStatusPageProps) {
  const { id } = await params;
  const table = await getPublicTable(id);

  if (!table) {
    notFound();
  }

  return <PaymentStatusView tableId={table.id} tableNumber={table.number} />;
}
