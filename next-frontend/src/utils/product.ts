// Parsea un string de precio de WooCommerce (simple o rango) y devuelve un array de números.
// Ej. 1: "S/&nbsp;1,000.00 - S/&nbsp;1,799.00" => [1000.00, 1799.00]
// Ej. 2: "S/&nbsp;1,000.00" => [1000.00]
export const parsePrice = (
  priceString: string | null | undefined
): number[] => {
  if (!priceString) return [];

  try {
    const priceParts = priceString
      .replace(/S\/&nbsp;/g, "")
      .replace(/,/g, "")
      .split(" - ");

    return priceParts
      .map((part) => parseFloat(part))
      .filter((num) => !isNaN(num));
  } catch (error) {
    console.error("Error al parsear el precio:", error);
    return [];
  }
};

// Formatea un array de precios numéricos para su visualización.
// [1000.00, 1799.00] => "S/ 1000.00 - S/ 1799.00".
export const formatPriceDisplay = (prices: number[]): string | null => {
  if (prices.length === 0) {
    return null;
  }
  return prices.map((p) => `S/ ${p.toFixed(2)}`).join(" - ");
};

// Calcula el porcentaje de descuento entre dos precios.
export const calculateDiscount = (
  regularPrice: number,
  salePrice: number
): number | null => {
  if (!regularPrice || !salePrice || regularPrice <= salePrice) return null;
  const discount = ((regularPrice - salePrice) / regularPrice) * 100;
  return Math.round(discount);
};

// Extraer un color hexadecimal de la descripción de una variante.
export const parseColorFromDescription = (
  description: string | null | undefined
): string | null => {
  if (!description) return null;
  const match = description.match(/attr\.color:\s*(#[0-9a-fA-F]{6})/i);
  return match ? match[1] : null;
};
