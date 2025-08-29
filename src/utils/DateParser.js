function parseDate(dateStr) {
  if (!dateStr) return "";

  // Replace - or / with a single separator
  let parts = dateStr.replace(/[-.]/g, "/").split("/");

  // If format is YYYY/MM/DD
  if (parts[0].length === 4) {
    const [y, m, d] = parts;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  // Otherwise assume DD/MM/YYYY or M/D/YYYY
  if (parts.length === 3) {
    const [d, m, y] = parts;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  // Try Date() fallback
  const dObj = new Date(dateStr);
  if (!isNaN(dObj)) {
    const year = dObj.getFullYear();
    const month = String(dObj.getMonth() + 1).padStart(2, "0");
    const day = String(dObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return "";
}
export default parseDate;
