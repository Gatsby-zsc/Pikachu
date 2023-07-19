export function formatSinglePrice(price: number): string {
  return price === 0 ? "Free" : "$" + price.toString();
}

export function formatPriceRange(prices: number[]): string {
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  if (maxPrice === 0) {
    return "Free";
  } else if (minPrice === maxPrice) {
    return "$" + maxPrice.toString();
  } else {
    // When minPrice is 0, display "From Free"
    const displayMinPrice = minPrice === 0 ? "Free" : "$" + minPrice.toString();
    return "From " + displayMinPrice;
  }
}

export function formatPriceInObject(data: { price: number }[]): string {
  const prices = data.map((item) => item.price);
  return formatPriceRange(prices);
}
