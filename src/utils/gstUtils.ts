/**
 * Represents the result of a GST calculation.
 */
interface GSTCalculationResult {
  preGSTAmount: number;
  postGSTAmount: number;
  cgstRate: number;
  sgstRate: number;
  GSTAmount: number;
  CGSTAmount: number;
  SGSTAmount: number;
}

/**
 * Calculates the GST (Goods and Services Tax) for a given item.
 *
 * @param quantity - The quantity of the item.
 * @param rate - The rate or price per unit of the item.
 * @param gstRate - The GST rate as a percentage.
 * @returns A GSTCalculationResult object containing the calculated GST details.
 */
export const calculateGSTForItem = (
  quantity: number,
  rate: number,
  gstRate: number
): GSTCalculationResult => {
  const taxableValue: number = quantity * rate;
  const totalGSTAmount: number = taxableValue * (gstRate / 100);
  const cgstAmount: number = totalGSTAmount / 2;
  const sgstAmount: number = totalGSTAmount / 2;
  const preGSTAmount = taxableValue;
  const postGSTAmount = taxableValue + totalGSTAmount;

  const cgstRate: number = gstRate / 2;
  const sgstRate: number = gstRate / 2;

  return {
    preGSTAmount: preGSTAmount,
    postGSTAmount: postGSTAmount,
    cgstRate: cgstRate,
    sgstRate: sgstRate,
    GSTAmount: totalGSTAmount,
    CGSTAmount: cgstAmount,
    SGSTAmount: sgstAmount,
  };
};
