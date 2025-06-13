const CART_KEY = 'cartItems';

/**
 * Busca os itens do carrinho no localStorage.
 * @returns {Array} A lista de itens do carrinho ou um array vazio.
 */
export const getCart = () => {
  try {
    const localData = localStorage.getItem(CART_KEY);
    return localData ? JSON.parse(localData) : [];
  } catch (error) {
    console.error("Erro ao ler o carrinho do localStorage:", error);
    return [];
  }
};

/**
 * Salva a lista de itens do carrinho no localStorage.
 * @param {Array} cartItems A lista de itens a ser salva.
 */
export const saveCart = (cartItems) => {
  try {
    const dataToStore = JSON.stringify(cartItems);
    localStorage.setItem(CART_KEY, dataToStore);
  } catch (error) {
    console.error("Erro ao salvar o carrinho no localStorage:", error);
  }
};