# PDF to JSON Converter

A TypeScript utility that converts PDF documents into structured JSON data while preserving text content, formatting, and hyperlinks. Perfect for resume parsing, document analysis, and content extraction workflows.

## ✨ Features

- **Text Extraction**: Extract text content with precise positioning and styling
- **Hyperlink Detection**: Capture clickable links with their coordinates and target URLs
- **Font Preservation**: Maintains font information for each text element
- **Multi-page Support**: Processes documents of any length
- **Type Safety**: Built with TypeScript for better development experience
- **Lightweight**: Minimal dependencies

## 📦 Installation

### Prerequisites

Make sure you have the following installed on your system:
- Node.js (v16 or higher)
- npm (v7 or higher) or yarn

### Install the package

Using npm:
```bash
npm install @shilendra-dev/pdf-to-json
```

Or using yarn:
```bash
yarn add @shilendra-dev/pdf-to-json
```

### Peer Dependencies

This package requires the following peer dependencies which will be installed automatically:
- `pdfjs-dist`: ^3.4.120 (PDF.js library for PDF parsing)
- `@types/node`: ^18.0.0 (TypeScript types for Node.js)

## 🚀 Usage

```typescript
import { pdfToJson } from '@shilendra-dev/pdf-to-json';
import fs from 'fs/promises';

async function convertPdfToJson() {
  try {
    // Read PDF file
    const pdfBuffer = await fs.readFile('path/to/your/document.pdf');

    // Convert to JSON
    const result = await pdfToJson(pdfBuffer, {
      outputPath: 'output.json'  // Optional: Path to save the JSON output
    });

    console.log('Conversion complete!');
    console.log(`Processed ${result.numPages} pages`);
  } catch (error) {
    console.error('Error converting PDF:', error);
  }
}

convertPdfToJson();
```

## 📝 API

### `pdfToJson(pdfSource: Buffer | string, options?: PdfToJsonOptions): Promise<PdfJsonResult>`

Converts a PDF document to JSON.

**Parameters:**
- `pdfSource`: PDF file as Buffer or file path
- `options`: (Optional) Configuration options
  - `outputPath`: (string) Path to save the JSON output file
  - `includeTextContent`: (boolean) Whether to include raw text content (default: true)
  - `includeStyles`: (boolean) Whether to include font and style information (default: true)
  - `includeLinks`: (boolean) Whether to include hyperlinks (default: true)

**Returns:** Promise that resolves to the parsed PDF data

## 📂 Output Format

The converter generates a JSON object with the following structure:

```typescript
{
  numPages: number;
  pages: Array<{
    pageNumber: number;
    width: number;
    height: number;
    items: Array<{
      type: 'text' | 'link';
      content: string;
      x: number;
      y: number;
      width: number;
      height: number;
      fontFamily?: string;
      fontSize?: number;
      color?: string;
      url?: string;  // For links
    }>;
  }>;
}
```

## 🔍 Example

```typescript
import { pdfToJson } from '@shilendra-dev/pdf-to-json';

// Convert PDF from URL
const response = await fetch('https://example.com/document.pdf');
const pdfBuffer = await response.arrayBuffer();
const result = await pdfToJson(Buffer.from(pdfBuffer));

// Process the extracted data
result.pages.forEach(page => {
  console.log(`Page ${page.pageNumber} (${page.width}x${page.height}):`);
  console.log(`- Contains ${page.items.length} text items`);
});
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [Shilendra Singh](https://github.com/shilendrasingh)
