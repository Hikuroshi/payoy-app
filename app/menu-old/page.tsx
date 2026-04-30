"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CategoryButton, CategorySkeletons, CheckoutBar, FoodSkeletons, MenuEmptyState, MenuItemCard } from "./menu";
import { type MenuFood } from "./menu-data";
import { useMenu } from "./use-menu";
import { TableDrawer } from "./table-drawer";

export default function Menu() {
  const { activeFoods, addItem, reload, selectCategory, state } = useMenu();
  const { activeCategory, cartSummary, categories, errorMessage, loadingCategories, loadingFoods } = state;

  function handleAddItem(item: MenuFood) {
    addItem(item);

    toast.success("Item ditambahkan", {
      description: `${item.name} masuk ke checkout.`,
      duration: 1800,
    });
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="relative">
        <div className="mx-auto flex min-h-svh w-full max-w-5xl flex-col bg-background px-4 pb-28 pt-4 sm:px-5 md:px-6">
          <header className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-2xl font-extrabold leading-tight tracking-normal sm:text-3xl">Menu</h1>

              {errorMessage ? <p className="mt-1.5 max-w-xl text-xs text-muted-foreground sm:text-sm">{errorMessage}</p> : null}
            </div>

            <p className="shrink-0 pt-1 text-sm font-extrabold text-muted-foreground sm:text-base">Meja #02</p>
          </header>

          <div className="-mx-4 mt-4 sm:mx-0">
            <div data-menu-category-scroll className="w-full overflow-x-auto pb-3">
              {loadingCategories ? (
                <CategorySkeletons />
              ) : (
                <div className="flex w-max gap-2 px-4 sm:px-0">
                  {categories.map((category) => (
                    <CategoryButton key={category.id} category={category} active={activeCategory === category.name} onSelect={(categoryName) => void selectCategory(categoryName)} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <section className="mt-5">
            <div className="flex items-end justify-between gap-3">
              <h2 className="min-w-0 truncate text-xl font-extrabold leading-tight tracking-normal sm:text-2xl">{activeCategory || "Menu"}</h2>

              {errorMessage ? (
                <Button type="button" variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={() => void reload()}>
                  Muat ulang
                </Button>
              ) : null}
            </div>

            <div className="mt-3.5">
              {loadingFoods || loadingCategories ? (
                <FoodSkeletons />
              ) : activeFoods.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {activeFoods.map((item, index) => (
                    <MenuItemCard key={item.id} item={item} eager={index < 6} onAdd={handleAddItem} />
                  ))}
                </div>
              ) : (
                <MenuEmptyState onRetry={() => void selectCategory(activeCategory)} />
              )}
            </div>
          </section>
        </div>

        <CheckoutBar count={cartSummary.count} total={cartSummary.total} />
      </div>

      <TableDrawer />
    </main>
  );
}
