# PDF to JSON Converter

A TypeScript utility that converts PDF documents into structured JSON data while preserving text content, formatting, and hyperlinks. Perfect for resume parsing, document analysis, and content extraction workflows.

## ✨ Features

- **Text Extraction**: Extract text content with precise positioning and styling
- **Hyperlink Detection**: Capture clickable links with their coordinates and target URLs
- **Font Preservation**: Maintains font information for each text element
- **Multi-page Support**: Processes documents of any length
- **Type Safety**: Built with TypeScript for better development experience
- **Lightweight**: No external dependencies beyond PDF.js

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/pdf-to-json.git
cd pdf-to-json

# Install dependencies
npm install
```

## 🛠️ Usage

```typescript
import { pdfToJson } from './src/pdfToJson';
import fs from 'fs';

// Read PDF file
const pdfBuffer = fs.readFileSync('path/to/your/document.pdf');

// Convert to JSON
const result = await pdfToJson(
  pdfBuffer,
  'output.json'  // Optional: Path to save the JSON output
);

console.log('Conversion complete!');
```

## 📦 Output Format

The converter generates a JSON object with the following structure:

```typescript
{
  numPages: number;
  pages: Array<{
    pageNumber: number;
    width: number;
    height: number;
    items: Array<{
      text: string;
      transform: number[];
      fontName: string;
      link?: string;
    }>;
    links: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
      url: string;
    }>;
  }>;
}
```

## 🔍 Example

### Input PDF
A PDF containing formatted text and hyperlinks.

### Output JSON
```json
{
  "numPages": 1,
  "pages": [
    {
      "pageNumber": 1,
      "width": 595.28,
      "height": 841.89,
      "items": [
        {
          "text": "My Resume",
          "transform": [16, 0, 0, 16, 72, 800],
          "fontName": "Helvetica-Bold"
        },
        {
          "text": "Visit my website",
          "transform": [12, 0, 0, 12, 72, 750],
          "fontName": "Helvetica",
          "link": "https://example.com"
        }
      ],
      "links": [
        {
          "x": 72,
          "y": 738,
          "width": 100,
          "height": 14,
          "url": "https://example.com"
        }
      ]
    }
  ]
}
```

## 🛠 Development

```bash
# Build the project
npm run build

# Run tests
npm test
```
