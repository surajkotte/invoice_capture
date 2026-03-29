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
export const date_format_mapping = {
  0: "MM/DD/YYYY",
  1: "DD/MM/YYYY",
  2: "YYYY/DD/MM",
  3: "MM-DD-YYYY",
  4: "DD-MM-YYYY",
  5: "YYYY-MM-DD",
};

// Helper to safely get the user's preferred format
export const getUserDateFormat = () => {
  const formatIndex = sessionStorage.getItem("dateformat");
  return date_format_mapping[formatIndex] || "YYYY-MM-DD"; // Default fallback
};

// 1. Parse incoming date into standard "YYYY-MM-DD" for the HTML date picker
export const parseToStandardDate = (dateStr) => {
  if (!dateStr) return "";

  // FIX: If the date is ALREADY in standard YYYY-MM-DD format (from React state or DB), 
  // return it immediately so we don't scramble the month and day!
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }

  // Normalize separators to hyphens
  let parts = dateStr.replace(/[-.\/]/g, "-").split("-");

  if (parts.length !== 3) {
    // Fallback for weird string formats (e.g., "Jan 5 2023")
    const dObj = new Date(dateStr);
    if (!isNaN(dObj)) return dObj.toISOString().split('T')[0];
    return "";
  }

  let y, m, d;
  const userFormat = getUserDateFormat();

  // If year is first
  if (parts[0].length === 4) {
    y = parts[0];
    // Only swap if we KNOW the input string is in the user's exact format
    if (userFormat.startsWith("YYYY/DD") || userFormat.startsWith("YYYY-DD")) {
      d = parts[1]; m = parts[2];
    } else {
      m = parts[1]; d = parts[2];
    }
  }
  // If year is last
  else if (parts[2].length === 4) {
    y = parts[2];
    if (userFormat.startsWith("DD")) {
      d = parts[0]; m = parts[1];
    } else {
      m = parts[0]; d = parts[1];
    }
  } else {
    // Ultimate fallback
    const dObj = new Date(dateStr);
    if (!isNaN(dObj)) return dObj.toISOString().split('T')[0];
    return "";
  }

  // Ensure valid output lengths
  return `${y}-${m?.padStart(2, "0")}-${d?.padStart(2, "0")}`;
};

// 2. Format a standard "YYYY-MM-DD" date into the User's Display Preference
export const formatToUserDisplay = (standardDateStr) => {
  if (!standardDateStr) return "";

  // Ensure we are working with a clean base
  const cleanDate = parseToStandardDate(standardDateStr);
  if (!cleanDate) return "";

  const [y, m, d] = cleanDate.split("-");
  const userFormat = getUserDateFormat();

  return userFormat
    .replace("YYYY", y)
    .replace("MM", m)
    .replace("DD", d);
};