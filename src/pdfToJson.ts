import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

interface PdfTextItem {
    text: string;
    transform: number[];
    fontName: string;
    link?: string;
}

interface PdfPage {
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

interface PdfJson {
    numPages: number;
    pages: PdfPage[];
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

/**
 * Convert PDF buffer into structured JSON with hyperlink support
 */
export async function pdfToJson(
    pdfData: Uint8Array,
    outputPath: string
): Promise<PdfJson> {
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;

    const pdfJson: PdfJson = {
        numPages: pdf.numPages,
        pages: [],
    };

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const [content, annotations] = await Promise.all([
            page.getTextContent() as Promise<TextContent>,
            page.getAnnotations()
        ]);

        const viewport = page.getViewport({ scale: 1.0 });

        // Process text content
        const items: PdfTextItem[] = content.items.map((item: TextItem) => ({
            text: item.str,
            transform: item.transform,
            fontName: item.fontName,
        }));

        // Process links
        const links = annotations
            .filter(anno => anno.subtype === 'Link' && anno.url)
            .map(link => ({
                x: link.rect[0],
                y: viewport.height - link.rect[3], // Convert from PDF coordinate system
                width: link.rect[2] - link.rect[0],
                height: link.rect[3] - link.rect[1],
                url: link.url || ''
            }));

        pdfJson.pages.push({
            pageNumber: pageNum,
            width: viewport.width,
            height: viewport.height,
            items,
            links
        });
    }

    fs.writeFileSync(outputPath, JSON.stringify(pdfJson, null, 2), "utf-8");
    return pdfJson;
}
