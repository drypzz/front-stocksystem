import { getUser } from "./auth";

const BASE_CART_KEY = "cartItems";

const generateUserCartKey = () => {
  const user = getUser();
  if (!user || !user.id) {
    return null;
  }
  return `${BASE_CART_KEY}_user_${user.id}`;
};

export const getCart = () => {
  const userCartKey = generateUserCartKey();

  if (!userCartKey) {
    return [];
  }

  try {
    const localData = localStorage.getItem(userCartKey);
    return localData ? JSON.parse(localData) : [];
  } catch (error) {
    return [];
  }
};

export const saveCart = (cartItems) => {
  const userCartKey = generateUserCartKey();

  if (!userCartKey) {
    return;
  }

  try {
    const dataToStore = JSON.stringify(cartItems);
    localStorage.setItem(userCartKey, dataToStore);
  } catch (error) {
    console.error("Erro ao salvar o carrinho no localStorage:", error);
  }
};

export const clearUserCartFromStorage = () => {
  const userCartKey = generateUserCartKey();
  if (userCartKey) {
    localStorage.removeItem(userCartKey);
  }
};