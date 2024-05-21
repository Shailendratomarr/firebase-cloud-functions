const fetch = require('node-fetch');
const sharp = require('sharp');
const { logger } = require('../logger/index.js');

async function validateImageUrl(imageUrl) {
    try {
        new URL(imageUrl);

        const response = await fetch(imageUrl);
        if (!response.ok) {
            return false;
        }

        if (response.redirected) {
            return false;
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !(
            contentType.includes('image/png') ||
            contentType.includes('image/jpeg') ||
            contentType.includes('image/gif') ||
            contentType.includes('image/bmp') ||
            contentType.includes('image/tiff') ||
            contentType.includes('image/webp')
        )) {
            return false;
        }
        return true;
    } catch (error) {
        logger.error("error validating imageUrl", {
            imageUrl: imageUrl,
            error: error
        });
        return false;
    }
}

function calculateDPI(pixelWidth, pixelHeight) {
    const originalPixels = pixelWidth * pixelHeight;

    const resizedWidthInches = 2.82;
    const resizedHeightInches = 5.78;

    const resizedInches = resizedWidthInches * resizedHeightInches;

    const dpi = originalPixels / resizedInches;

    return dpi;
}

async function getImageDimensions(imageUrl) {
    try {
        const response = await fetch(imageUrl);
        const buffer = await response.buffer();
        const metadata = await sharp(buffer).metadata();
        const width = metadata.width || 0;
        const height = metadata.height || 0;
        return { width, height };
    } catch (error) {
        logger.error("error fetching image dimensions", {
            imageUrl: imageUrl,
            error: error
        });
        return {};
    }
}

async function validateProductUrl(productUrl) {
    try {
        new URL(productUrl);

        const response = await fetch(productUrl, { method: 'HEAD' });
        if (response.redirected) {
            return false;
        }

        if (!response.ok) {
            return false;
        }

        return true;
    } catch (error) {
        logger.error("error validating productUrl", {
            productUrl: productUrl,
            error: error
        });
        return false;
    }
}

module.exports = {
    validateImageUrl,
    calculateDPI,
    getImageDimensions,
    validateProductUrl
};
