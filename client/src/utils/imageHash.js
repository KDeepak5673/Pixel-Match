// client/src/utils/imageHash.js

/**
 * Client-side perceptual hashing utilities using HTML5 Canvas
 * Implements dHash (difference hash) algorithm for 64-bit image similarity
 */

/**
 * Loads an image from URL or File and returns an Image object
 * @param {string|File} source - Image URL or File object
 * @returns {Promise<Image>} Loaded image
 */
export function loadImage(source) {
    return new Promise((resolve, reject) => {
        const img = new Image();

        // Handle CORS for external URLs
        img.crossOrigin = 'anonymous';

        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image'));

        if (typeof source === 'string') {
            img.src = source;
        } else if (source instanceof File) {
            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(source);
        } else {
            reject(new Error('Invalid image source'));
        }
    });
}

/**
 * Computes a 64-bit dHash (difference hash) from an image
 * @param {Image} img - Loaded image object
 * @returns {string} 64-character hexadecimal hash
 */
export function computeDHash(img) {
    // Create canvas and resize to 9x8 (for 8x8 differences = 64 bits)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 9;
    canvas.height = 8;

    // Draw and resize image
    ctx.drawImage(img, 0, 0, 9, 8);

    // Get image data
    const imageData = ctx.getImageData(0, 0, 9, 8);
    const data = imageData.data;

    // Convert to grayscale and compute differences
    let hash = '';

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            // Get grayscale values of adjacent pixels
            const leftGray = getGrayscale(data, x, y, 9);
            const rightGray = getGrayscale(data, x + 1, y, 9);

            // Set bit based on difference
            hash += (leftGray > rightGray) ? '1' : '0';
        }
    }

    // Convert binary to hex
    let hexHash = '';
    for (let i = 0; i < hash.length; i += 4) {
        const nibble = hash.substr(i, 4);
        hexHash += parseInt(nibble, 2).toString(16);
    }

    return hexHash;
}

/**
 * Gets grayscale value from RGBA data
 * @param {Uint8ClampedArray} data - Image data array
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} width - Image width
 * @returns {number} Grayscale value (0-255)
 */
function getGrayscale(data, x, y, width) {
    const index = (y * width + x) * 4;
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    // Standard luminance formula
    return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
}

/**
 * Calculates Hamming distance between two hexadecimal hashes
 * @param {string} hash1 - First hash
 * @param {string} hash2 - Second hash
 * @returns {number} Hamming distance
 */
export function hammingDistance(hash1, hash2) {
    if (hash1.length !== hash2.length) {
        throw new Error('Hashes must be the same length');
    }

    let distance = 0;

    for (let i = 0; i < hash1.length; i++) {
        // Convert hex chars to binary and compare
        const bin1 = parseInt(hash1[i], 16).toString(2).padStart(4, '0');
        const bin2 = parseInt(hash2[i], 16).toString(2).padStart(4, '0');

        for (let j = 0; j < 4; j++) {
            if (bin1[j] !== bin2[j]) {
                distance++;
            }
        }
    }

    return distance;
}

/**
 * Computes similarity score (0-1) from Hamming distance
 * @param {number} distance - Hamming distance
 * @param {number} maxDistance - Maximum possible distance (64 for 64-bit hash)
 * @returns {number} Similarity score
 */
export function calculateSimilarity(distance, maxDistance = 64) {
    return 1 - (distance / maxDistance);
}

/**
 * Main function to hash an image from URL or File
 * @param {string|File} source - Image source
 * @returns {Promise<string>} 64-bit hexadecimal hash
 */
export async function hashImage(source) {
    try {
        const img = await loadImage(source);
        return computeDHash(img);
    } catch (error) {
        throw new Error(`Failed to hash image: ${error.message}`);
    }
}