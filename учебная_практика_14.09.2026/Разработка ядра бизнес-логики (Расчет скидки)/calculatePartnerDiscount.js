export function calculatePartnerDiscount(totalQuantity) {
  switch (true) {
    case totalQuantity < 10000:
      return 0;

    case totalQuantity < 50000:
      return 5;

    case totalQuantity < 300000:
      return 10;

    default:
      return 15;
  }
}
