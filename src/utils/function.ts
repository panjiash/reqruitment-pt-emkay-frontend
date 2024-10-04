export function formatRupiah(value: any) {
  const floatValue = parseFloat(value);
  if (typeof floatValue !== "number") {
    throw new Error("Value harus berupa angka");
  }
  const formattedValue = floatValue.toFixed(2);
  const parts = formattedValue.split(".");
  let integerPart = parts[0];
  const decimalPart = parts[1];
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${integerPart},${decimalPart}`;
}
