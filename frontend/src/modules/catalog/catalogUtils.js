// Utilidades de presentación del catálogo (el precio llega como decimal/string).
export function formatPrice(value) {
  return `$${Number(value ?? 0).toFixed(2)}`;
}
