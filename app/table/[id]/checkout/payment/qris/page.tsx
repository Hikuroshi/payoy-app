import { notFound } from "next/navigation";
import { getPublicTable } from "../../../_components/table-data";

import { QrisPaymentView } from "./qris-payment-view";

export const metadata = {
  title: "Pembayaran",
};

type QrisPaymentPageProps = {
  params: Promise<{ id: string }>;
};

export default async function QrisPaymentPage({
  params,
}: QrisPaymentPageProps) {
  const { id } = await params;
  const table = await getPublicTable(id);

  if (!table) {
    notFound();
  }

  return <QrisPaymentView tableId={table.id} tableNumber={table.number} />;
}
