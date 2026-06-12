/**
 * Export an array of records to a downloadable CSV file.
 * Keys are inferred from the first row when columns is not provided.
 */
export function exportToCsv<T extends Record<string, any>>(
  filename: string,
  rows: T[],
  columns?: (keyof T)[]
): void {
  if (!rows || rows.length === 0) {
    return;
  }

  const cols = (columns ?? (Object.keys(rows[0]) as (keyof T)[])) as string[];

  const escape = (val: unknown): string => {
    if (val === null || val === undefined) return "";
    let str: string;
    if (Array.isArray(val)) str = val.join("; ");
    else if (typeof val === "object") str = JSON.stringify(val);
    else str = String(val);
    if (/[",\n\r]/.test(str)) {
      str = `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const header = cols.map(escape).join(",");
  const body = rows
    .map((row) => cols.map((c) => escape((row as any)[c])).join(","))
    .join("\n");
  const csv = `${header}\n${body}`;

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
