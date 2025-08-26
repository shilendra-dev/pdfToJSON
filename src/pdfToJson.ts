import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export interface PdfTextItem {
  text: string;
  transform: number[];
  fontName: string;
  link?: string;
}

export interface PdfPage {
  pageNumber: number;
  width: number;
  height: number;
  items: PdfTextItem[];
  links: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    url: string;
  }>;
}

export interface PdfJson {
  numPages: number;
  pages: PdfPage[];
  metadata?: Record<string, any>;
}

interface TextItem {
  str: string;
  transform: number[];
  fontName: string;
  [key: string]: any;
}

interface TextContent {
  items: TextItem[];
  [key: string]: any;
}

interface ProcessPdfOptions {
  scale?: number;
  includeLinks?: boolean;
  outputPath?: string;
}

/**
 * Convert PDF data to structured JSON
 * @param pdfData PDF file as Uint8Array
 * @param options Processing options
 * @returns Parsed PDF data
 */
export async function pdfToJson(
  pdfData: Uint8Array,
  options: ProcessPdfOptions = {}
): Promise<PdfJson> {
  const { scale = 1.0, includeLinks = true, outputPath } = options;
  
  // @ts-ignore - PDF.js types issue with ESM
  const loadingTask = pdfjsLib.getDocument({ data: pdfData });
  const pdf = await loadingTask.promise;

  const pdfJson: PdfJson = {
    numPages: pdf.numPages,
    pages: [],
  };

  // Get document metadata if available
  try {
    const metadata = await pdf.getMetadata();
    if (metadata) {
      pdfJson.metadata = {
        ...metadata.info,
        metadata: metadata.metadata ? 
          (metadata.metadata as any).getAll ? 
            await (metadata.metadata as any).getAll() : 
            metadata.metadata : 
          undefined
      };
    }
  } catch (error) {
    console.warn('Could not extract PDF metadata:', error);
  }
  //loop through each page
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    
    //get text content and annotations
    const [content, annotations] = await Promise.all([
      page.getTextContent() as Promise<TextContent>,
      includeLinks ? page.getAnnotations() : Promise.resolve([])
    ]);

    // Process text content
    const items: PdfTextItem[] = content.items.map((item: TextItem) => ({
      text: item.str,
      transform: item.transform,
      fontName: item.fontName,
    }));

    // Process links if enabled
    const links = includeLinks 
      ? annotations
          .filter(anno => anno.subtype === 'Link' && (anno.url || anno.unsafeUrl))
          .map(link => ({
            x: link.rect[0],
            y: viewport.height - link.rect[3],
            width: link.rect[2] - link.rect[0],
            height: link.rect[3] - link.rect[1],
            url: link.url || link.unsafeUrl || ''
          }))
      : [];

    //push page data to pdfJson
    pdfJson.pages.push({
      pageNumber: pageNum,
      width: viewport.width,
      height: viewport.height,
      items,
      links
    });
  }

  //write to file if outputPath is provided
  if (outputPath) {
    fs.writeFileSync(outputPath, JSON.stringify(pdfJson, null, 2), "utf-8");
  }

  return pdfJson;
}
