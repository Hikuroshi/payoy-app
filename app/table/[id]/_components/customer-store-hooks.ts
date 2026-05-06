"use client";

import * as React from "react";
import { isOrderStatus } from "@/lib/order";

import {
  getCartItems,
  getLatestOrder,
  saveOrder,
  subscribeToCart,
  subscribeToOrder,
  type CustomerCartItem,
  type CustomerOrder,
  type CustomerOrderStatus,
} from "./customer-cart";

const emptyCartSnapshot: CustomerCartItem[] = [];

function getServerCartSnapshot() {
  return emptyCartSnapshot;
}

function getServerOrderSnapshot() {
  return null;
}

type RemoteOrderStatus = {
  completedAt: string | null;
  paidAt: string | null;
  status: CustomerOrderStatus;
};

function isRemoteOrderStatus(value: unknown): value is CustomerOrderStatus {
  return isOrderStatus(value);
}

function hasOrderChanged(order: CustomerOrder, remote: RemoteOrderStatus) {
  return (
    order.status !== remote.status ||
    (order.paidAt ?? null) !== remote.paidAt ||
    (order.completedAt ?? null) !== remote.completedAt
  );
}

async function fetchRemoteOrderStatus(
  order: CustomerOrder,
  tableId: string,
  signal: AbortSignal
): Promise<RemoteOrderStatus | null> {
  if (!order.databaseId) {
    return null;
  }

  try {
    const response = await fetch(
      `/api/customer/orders/${order.databaseId}?tableId=${encodeURIComponent(tableId)}`,
      {
        cache: "no-store",
        signal,
      }
    );

    if (!response.ok) {
      return null;
    }

    const data: unknown = await response.json();

    if (!data || typeof data !== "object") {
      return null;
    }

    const remote = data as {
      completedAt?: unknown;
      paidAt?: unknown;
      status?: unknown;
    };

    if (!isRemoteOrderStatus(remote.status)) {
      return null;
    }

    return {
      completedAt:
        typeof remote.completedAt === "string" ? remote.completedAt : null,
      paidAt: typeof remote.paidAt === "string" ? remote.paidAt : null,
      status: remote.status,
    };
  } catch {
    return null;
  }
}

export function useCartItems(tableId: string) {
  const subscribe = React.useCallback(
    (callback: () => void) => subscribeToCart(tableId, callback),
    [tableId]
  );
  const getSnapshot = React.useCallback(() => getCartItems(tableId), [tableId]);

  return React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerCartSnapshot
  );
}

export function useLatestOrder(tableId: string) {
  const subscribe = React.useCallback(
    (callback: () => void) => subscribeToOrder(tableId, callback),
    [tableId]
  );
  const getSnapshot = React.useCallback(
    () => getLatestOrder(tableId),
    [tableId]
  );

  return React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerOrderSnapshot
  );
}

export function useSyncedLatestOrder(tableId: string) {
  const order = useLatestOrder(tableId);

  React.useEffect(() => {
    if (!order?.databaseId) {
      return;
    }

    const controller = new AbortController();
    let stopped = false;

    async function syncOrderStatus() {
      const latestOrder = getLatestOrder(tableId);

      if (
        stopped ||
        !latestOrder?.databaseId ||
        latestOrder.databaseId !== order?.databaseId ||
        latestOrder.status === "done" ||
        latestOrder.status === "cancelled"
      ) {
        return;
      }

      const remote = await fetchRemoteOrderStatus(
        latestOrder,
        tableId,
        controller.signal
      );

      if (stopped || !remote) {
        return;
      }

      const currentOrder = getLatestOrder(tableId);

      if (
        !currentOrder?.databaseId ||
        currentOrder.databaseId !== latestOrder.databaseId ||
        !hasOrderChanged(currentOrder, remote)
      ) {
        return;
      }

      saveOrder({
        ...currentOrder,
        completedAt: remote.completedAt ?? undefined,
        paidAt: remote.paidAt ?? undefined,
        status: remote.status,
      });
    }

    void syncOrderStatus();

    const interval = window.setInterval(() => {
      void syncOrderStatus();
    }, 2000);

    return () => {
      stopped = true;
      window.clearInterval(interval);
      controller.abort();
    };
  }, [order?.databaseId, tableId]);

  return order;
}
