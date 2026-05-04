import { TableNotFound } from "../_components/customer-order-ui";
import { getPublicTable } from "../_components/table-data";

import { CheckoutView } from "./checkout-view";

type CheckoutPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { id } = await params;
  const table = await getPublicTable(id);

  if (!table) {
    return <TableNotFound />;
  }

  return <CheckoutView tableId={table.id} tableNumber={table.number} />;
}
