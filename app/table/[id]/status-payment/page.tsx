import { TableNotFound } from "../_components/customer-order-ui";
import { getPublicTable } from "../_components/table-data";

import { PaymentStatusView } from "./payment-status-view";

type PaymentStatusPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PaymentStatusPage({
  params,
}: PaymentStatusPageProps) {
  const { id } = await params;
  const table = await getPublicTable(id);

  if (!table) {
    return <TableNotFound />;
  }

  return <PaymentStatusView tableId={table.id} tableNumber={table.number} />;
}
