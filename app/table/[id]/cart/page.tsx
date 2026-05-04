import { TableNotFound } from "../_components/customer-order-ui";
import { getPublicTable } from "../_components/table-data";

import { CartView } from "./cart-view";

type CartPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CartPage({ params }: CartPageProps) {
  const { id } = await params;
  const table = await getPublicTable(id);

  if (!table) {
    return <TableNotFound />;
  }

  return <CartView tableId={table.id} tableNumber={table.number} />;
}
