export const convertToBaseUnit = (product, quantity, unitType) => {
  let baseQty = 0;

  if (product.type === "fixed") {
    return {
      total: product.fixed_price * quantity,
      baseQty: quantity,
    };
  }

  // PACK SYSTEM
  if (unitType === "box") {
    baseQty = quantity * product.box_qty;
  }

  if (unitType === "strip") {
    baseQty = quantity * product.strip_qty;
  }

  if (unitType === "tablet") {
    baseQty = quantity;
  }

  return {
    baseQty,
    total: baseQty * product.mrp,
  };
};