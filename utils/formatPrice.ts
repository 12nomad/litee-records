const formatPrice = (unit_amount: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
    unit_amount / 100
  );

export default formatPrice;
