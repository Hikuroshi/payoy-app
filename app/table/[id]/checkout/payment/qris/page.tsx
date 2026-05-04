import { TableNotFound } from "../../../_components/customer-order-ui";
import { getPublicTable } from "../../../_components/table-data";

import { QrisPaymentView } from "./qris-payment-view";

type QrisPaymentPageProps = {
  params: Promise<{ id: string }>;
};

export default async function QrisPaymentPage({
  params,
}: QrisPaymentPageProps) {
  const { id } = await params;
  const table = await getPublicTable(id);

  if (!table) {
    return <TableNotFound />;
  }

  return <QrisPaymentView tableId={table.id} tableNumber={table.number} />;
}
