export const fetchProductDetails = async (nome) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`);
    const details = await response.json();
    return details;
  } catch (error) {
    console.error("Erro ao carregar produto:", error);
    throw error;
  }
}; 