"use server";

import fs from "fs";
import path from "path";
import Papa from "papaparse";

export async function getData() {
  try {
    const filePath = path.join(process.cwd(), "public", "data.csv");
    const file = fs.readFileSync(filePath, "utf8");
    const results = Papa.parse(file, { header: true });
    return results.data;
  } catch (error) {
    console.error("Error loading data:", error);
    return [];
  }
}
