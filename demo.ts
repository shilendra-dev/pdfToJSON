import { pdfToJson } from './src';

//demo function
async function main() {
  try {
    //convert pdf to json
    const result = await pdfToJson('test.pdf', {
      outputPath: 'output.json',
      scale: 1.0,
      includeLinks: true
    });

    console.log('PDF converted to JSON successfully!');
    console.log(`Processed ${result.numPages} pages`);
    console.log(`Output saved to output.json`);
    
    // Print first page summary
    if (result.pages.length > 0) {
      const firstPage = result.pages[0];
      console.log('\nFirst page summary:');
      console.log(`- Dimensions: ${firstPage.width}x${firstPage.height}`);
      console.log(`- Text items: ${firstPage.items.length}`);
      console.log(`- Links: ${firstPage.links.length}`);
      
      // Print first few text items
      console.log('\nSample text items:');
      firstPage.items.slice(0, 5).forEach((item, i) => {
        console.log(`  ${i + 1}. ${item.text.substring(0, 50)}${item.text.length > 50 ? '...' : ''}`);
      });
    }
  } catch (error) {
    console.error('Error converting PDF to JSON:', error);
    process.exit(1);
  }
}

main();
