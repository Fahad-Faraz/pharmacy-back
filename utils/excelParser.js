import XLSX from "xlsx";

export const parseExcel = async (buffer) => {
  try {
    const workbook = XLSX.read(buffer, {
      type: "buffer",
      cellDates: true,
    });

    const firstSheet = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[firstSheet];

    const data = XLSX.utils.sheet_to_json(worksheet, {
      defval: "",
      raw: false,
    });

    return data.map((row) => ({
      name: String(row.name || row.Name || "").trim(),

      company_name: String(
        row.company_name ||
          row.Company ||
          row.company ||
          ""
      ).trim(),

      product_type: String(
        row.product_type || "company"
      ).trim(),

      generic_name: String(
        row.generic_name || ""
      ).trim(),

      prefix: String(
        row.prefix || ""
      ).trim(),

      barcode: String(
        row.barcode || ""
      ).trim(),

      quantity: Number(
        row.quantity || 0
      ),

      mrp: Number(
        row.mrp || 0
      ),

      purchase_price: Number(
        row.purchase_price || 0
      ),

      trade_price: Number(
        row.trade_price || 0
      ),

      fixed_price: row.fixed_price
        ? Number(row.fixed_price)
        : null,

      discount: Number(
        row.discount || 0
      ),

      expiry_date:
        row.expiry_date || null,

      box_strips: Number(
        row.box_strips || 1
      ),

      strip_tablets: Number(
        row.strip_tablets || 1
      ),
    }));
  } catch (error) {
    throw new Error("Invalid Excel File");
  }
};