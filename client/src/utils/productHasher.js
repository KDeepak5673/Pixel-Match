// client/src/utils/productHasher.js

/**
 * Client-side product hash utilities
 * Loads products with precomputed hashes
 */

/**
 * Loads products from the data file
 * @returns {Promise<Array>} Array of product objects
 */
export async function loadProducts() {
    try {
        // Try to load precomputed hashes first
        const precomputedData = await import('../data/precomputedhashes.json');
        console.log('📦 Loaded precomputed product hashes');
        return precomputedData.default;
    } catch (error) {
        console.warn('Precomputed hashes not found, falling back to base products:', error.message);
        // Fallback to base products if precomputed file doesn't exist
        try {
            const productsData = await import('../data/products.json');
            return productsData.default;
        } catch (fallbackError) {
            console.error('Failed to load products:', fallbackError);
            throw fallbackError;
        }
    }
}

/**
 * Loads products with hashes from localStorage
 * @returns {Array|null} Products with hashes or null if not found
 */
export function loadProductsFromStorage() {
    try {
        const data = localStorage.getItem('productsWithHashes');
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Failed to load from localStorage:', error);
        return null;
    }
}