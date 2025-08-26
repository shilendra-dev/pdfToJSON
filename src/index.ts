import fs from "fs";
import { pdfToJson } from "./pdfToJson";

async function main() {
  const pdfBuffer = fs.readFileSync("test.pdf");
  // Convert Buffer to Uint8Array
  const pdfData = new Uint8Array(pdfBuffer);

  const result = await pdfToJson(pdfData, "resume.json");

  console.log("✅ PDF converted to JSON successfully!");
  console.log(result);
}

main().catch(console.error);
