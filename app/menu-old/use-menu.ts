"use client";

import * as React from "react";
import { fetchCategories, fetchFoodsByCategory, type MenuCategory, type MenuFood } from "./menu-data";

type CartSummary = {
  count: number;
  total: number;
};

export function useMenu() {
  const [categories, setCategories] = React.useState<MenuCategory[]>([]);
  const [activeCategory, setActiveCategory] = React.useState("");
  const [activeFoods, setActiveFoods] = React.useState<MenuFood[]>([]);
  const [loadingCategories, setLoadingCategories] = React.useState(true);
  const [loadingFoods, setLoadingFoods] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [cartSummary, setCartSummary] = React.useState<CartSummary>({
    count: 0,
    total: 0,
  });

  React.useEffect(() => {
    async function loadMenu() {
      try {
        const newCategories = await fetchCategories();
        setCategories(newCategories);

        if (newCategories.length === 0) {
          setLoadingCategories(false);
          return;
        }

        const firstCategory = newCategories[0].name;
        const foods = await fetchFoodsByCategory(firstCategory);

        setActiveCategory(firstCategory);
        setActiveFoods(foods);
        setErrorMessage("");
      } catch {
        setCategories([]);
        setActiveCategory("");
        setActiveFoods([]);
        setErrorMessage("Gagal memuat menu.");
      } finally {
        setLoadingCategories(false);
        setLoadingFoods(false);
      }
    }

    void loadMenu();
  }, []);

  async function reload() {
    setLoadingCategories(true);
    setLoadingFoods(false);
    setErrorMessage("");

    try {
      const newCategories = await fetchCategories();
      setCategories(newCategories);

      if (newCategories.length === 0) {
        setActiveCategory("");
        setActiveFoods([]);
        return;
      }

      const firstCategory = newCategories[0].name;
      const foods = await fetchFoodsByCategory(firstCategory);

      setActiveCategory(firstCategory);
      setActiveFoods(foods);
    } catch {
      setCategories([]);
      setActiveCategory("");
      setActiveFoods([]);
      setErrorMessage("Gagal memuat menu.");
    } finally {
      setLoadingCategories(false);
      setLoadingFoods(false);
    }
  }

  async function selectCategory(categoryName: string) {
    setActiveCategory(categoryName);
    setLoadingFoods(true);
    setErrorMessage("");

    try {
      const foods = await fetchFoodsByCategory(categoryName);
      setActiveFoods(foods);
    } catch {
      setActiveFoods([]);
      setErrorMessage("Gagal memuat menu.");
    } finally {
      setLoadingFoods(false);
    }
  }

  function addItem(item: MenuFood) {
    setCartSummary((current) => ({
      count: current.count + 1,
      total: current.total + item.price,
    }));
  }

  return {
    activeFoods,
    addItem,
    reload,
    selectCategory,
    state: {
      activeCategory,
      cartSummary,
      categories,
      errorMessage,
      loadingCategories,
      loadingFoods,
    },
  };
}
