// Browser-based hash update script
// Run this in the browser console on the Pixel Match app

async function updateAllHashes() {
    console.log('Starting hash update...');

    // Import the necessary functions (these need to be available globally)
    const { hashImage } = window.imageHashUtils;
    const productsData = window.productsData;

    if (!hashImage || !productsData) {
        console.error('Required functions/data not available. Make sure you\'re running this on the Pixel Match app page.');
        return;
    }

    const updatedProducts = [];
    let processed = 0;
    const total = productsData.length;

    console.log(`Processing ${total} products...`);

    for (const product of productsData) {
        try {
            console.log(`Processing ${processed + 1}/${total}: ${product.name}`);
            const hash = await hashImage(product.imageUrl);
            updatedProducts.push({
                ...product,
                hash: hash
            });
            processed++;
        } catch (error) {
            console.error(`Error hashing product ${product.id}:`, error);
            // Keep original hash if error occurs
            updatedProducts.push(product);
            processed++;
        }
    }

    console.log('Hash update completed!');
    console.log('Updated products:', updatedProducts.length);

    // Create download link for updated data
    const dataStr = JSON.stringify(updatedProducts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'updated-products.json';
    link.textContent = 'Download Updated Products JSON';

    // Add to page
    document.body.appendChild(link);
    console.log('Download link created. Click the link to download the updated products.json file.');
}

// Make function available globally
window.updateAllHashes = updateAllHashes;

console.log('Hash update function loaded. Run updateAllHashes() to start updating hashes.');