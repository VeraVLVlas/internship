const productTypes = {
  1: 1.1,
  2: 1.5,
  3: 2.0
};

const materialTypes = {
  1: 0.5,
  2: 1.0,
  3: 2.5
};

export function calculateMaterialRequirement(
  productTypeId,
  materialTypeId,
  quantity,
  param1,
  param2
) {
  if (!Number.isInteger(productTypeId)) {
    return -1;
  }

  if (!Number.isInteger(materialTypeId)) {
    return -1;
  }

  const productCoefficient = productTypes[productTypeId];
  const materialWastePercent = materialTypes[materialTypeId];

  if (productCoefficient === undefined) {
    return -1;
  }

  if (materialWastePercent === undefined) {
    return -1;
  }

  if (!Number.isInteger(quantity)) {
    return -1;
  }

  if (quantity <= 0) {
    return -1;
  }

  if (!Number.isFinite(param1)) {
    return -1;
  }

  if (!Number.isFinite(param2)) {
    return -1;
  }

  if (param1 <= 0) {
    return -1;
  }

  if (param2 <= 0) {
    return -1;
  }

  const baseMaterialPerUnit = param1 * param2 * productCoefficient;
  const totalMaterial = baseMaterialPerUnit * quantity;
  const materialWithWaste = totalMaterial * (1 + materialWastePercent / 100);

  return Math.ceil(materialWithWaste);
}
