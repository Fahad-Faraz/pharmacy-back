export const generateCustomerCode = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

export const calculateProfit = (sale, purchase) => {
  return sale - purchase;
};

export const convertToBaseUnit = (product, quantity, unitType) => {
  if (
    product.product_type === "general" ||
    product.product_type === "local" ||
    product.product_type === "franchise"
  ) {
    return {
      total: product.fixed_price * quantity,
      baseQty: quantity,
    };
  }

  let baseQty = 0;

  if (unitType === "box") {
    baseQty =
      quantity *
      product.unit_structure.box.strips *
      product.unit_structure.strip.tablets;
  } else if (unitType === "strip") {
    baseQty = quantity * product.unit_structure.strip.tablets;
  } else {
    baseQty = quantity;
  }

  return {
    baseQty,
    total: baseQty * product.mrp,
  };
};