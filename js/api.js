const BASE_URL = "http://localhost:3000";

export async function getProducts() {
  const response = await axios.get(`${BASE_URL}/products`);
  return response.data;
}

export async function getBouquets(page, limit) {
  const response = await axios.get(
    `${BASE_URL}/bouquets?_page=${page}&_limit=${limit}`
  );

  return response.data;
}