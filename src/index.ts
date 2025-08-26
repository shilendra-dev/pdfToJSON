import { readFileSync } from 'fs';
import { pdfToJson as pdfToJsonFn } from './pdfToJson';

export interface PdfToJsonOptions {
  /** Output file path (optional) */
  outputPath?: string;
  /** Scale factor for the PDF viewport (default: 1.0) */
  scale?: number;
  /** Whether to include link data (default: true) */
  includeLinks?: boolean;
}

/**
 * Convert a PDF file to JSON
 * @param filePath Path to the PDF file
 * @param options Conversion options
 * @returns Promise that resolves to the parsed PDF data
 */
export async function pdfToJson(
  filePath: string | Uint8Array,
  options: PdfToJsonOptions = {}
) {
  const {
    outputPath,
    scale = 1.0,
    includeLinks = true,
  } = options;

  const pdfData = typeof filePath === 'string'
    ? readFileSync(filePath) //returns Buffer
    : filePath; //filePath is Uint8Array

  const result = await pdfToJsonFn(new Uint8Array(pdfData), { scale, includeLinks });
  
  if (outputPath) {
    const fs = await import('fs');
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
  }
  
  return result;
}

export * from './pdfToJson';

export default {
  pdfToJson,
};
