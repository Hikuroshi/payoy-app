const API_URL = "https://www.themealdb.com/api/json/v1/1";

type Category = {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription?: string;
};

type Food = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

type FoodDetail = Food & {
  strCategory?: string;
  strInstructions?: string;
};

export type MenuCategory = {
  id: string;
  name: string;
  thumbnail: string;
  description?: string;
};

export type MenuFood = {
  id: string;
  name: string;
  thumbnail: string;
  price: number;
};

export type MenuFoodDetail = MenuFood & {
  category: string;
  description: string;
};

export function formatPrice(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export function getInitials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function getFoodPrice(foodId: string, index: number) {
  const idNumber = Number(foodId.slice(-3));
  const seed = Number.isNaN(idNumber) ? index : idNumber;

  return 12000 + (seed % 9) * 3000;
}

export async function fetchCategories(signal?: AbortSignal): Promise<MenuCategory[]> {
  const response = await fetch(`${API_URL}/categories.php`, { signal });

  if (!response.ok) {
    throw new Error("Gagal memuat kategori menu.");
  }

  const data = (await response.json()) as { categories?: Category[] };

  return (data.categories ?? []).slice(0, 12).map((category) => ({
    id: category.idCategory,
    name: category.strCategory,
    thumbnail: category.strCategoryThumb,
    description: category.strCategoryDescription,
  }));
}

export async function fetchFoodsByCategory(categoryName: string, signal?: AbortSignal): Promise<MenuFood[]> {
  const response = await fetch(`${API_URL}/filter.php?c=${encodeURIComponent(categoryName)}`, { signal });

  if (!response.ok) {
    throw new Error("Gagal memuat menu.");
  }

  const data = (await response.json()) as { meals?: Food[] };

  return (data.meals ?? []).slice(0, 18).map((meal, index) => ({
    id: meal.idMeal,
    name: meal.strMeal,
    thumbnail: meal.strMealThumb,
    price: getFoodPrice(meal.idMeal, index),
  }));
}

export async function fetchFoodDetail(id: string): Promise<MenuFoodDetail | null> {
  const response = await fetch(`${API_URL}/lookup.php?i=${encodeURIComponent(id)}`);

  if (!response.ok) {
    throw new Error("Gagal memuat detail menu.");
  }

  const data = (await response.json()) as { meals?: FoodDetail[] | null };
  const meal = data.meals?.[0];

  if (!meal) {
    return null;
  }

  return {
    id: meal.idMeal,
    name: meal.strMeal,
    thumbnail: meal.strMealThumb,
    price: getFoodPrice(meal.idMeal, 0),
    category: meal.strCategory ?? "-",
    description: meal.strInstructions ?? "Tidak ada deskripsi.",
  };
}
