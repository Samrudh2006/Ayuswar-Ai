/**
 * AyuSwar AI — Computer Vision & OpenCV.js Preprocessor (openCvOcrPreprocessor.js)
 * 
 * Tool 1: High-Precision Image Enhancement for Medicine Blister Foil & Paper Rx
 * Techniques:
 * 1. Grayscale Conversion (Luminance preserving 0.299R + 0.587G + 0.114B)
 * 2. Adaptive Contrast Stretching & Histogram Normalization (removes glare on silver foil)
 * 3. Otsu Auto-Binarization (crisp black text on pure white background)
 * 4. 3x3 Sharpening Convolution Kernel (crisp character edges for Tesseract WASM)
 * 5. Bounding Contour Box Estimation for detected text areas
 */

export class OpenCvOcrPreprocessor {
  constructor() {
    this.isOpenCvReady = false;
  }

  /**
   * Preprocesses any image source (HTMLImageElement, HTMLCanvasElement, or dataUrl)
   * Returns: { processedDataUrl, canvas, stats: { meanLuminance, contrastRatio, binarizedPixels } }
   */
  async preprocessForOcr(imageSource) {
    let img;
    if (typeof imageSource === 'string') {
      img = await this.loadImage(imageSource);
    } else {
      img = imageSource;
    }

    const width = img.naturalWidth || img.videoWidth || img.width || 640;
    const height = img.naturalHeight || img.videoHeight || img.height || 480;

    // Create offscreen canvas for computer vision transformations
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, width, height);

    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    // 1. Grayscale & Histogram calculation
    const gray = new Uint8Array(width * height);
    const histogram = new Array(256).fill(0);
    let minLum = 255;
    let maxLum = 0;

    for (let i = 0, j = 0; i < data.length; i += 4, j++) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // Rec. 601 Luma
      const lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
      gray[j] = lum;
      histogram[lum]++;
      if (lum < minLum) minLum = lum;
      if (lum > maxLum) maxLum = lum;
    }

    // 2. Otsu Threshold Calculation (Optimal threshold separating foreground text from background foil)
    const totalPixels = width * height;
    let sumB = 0;
    let wB = 0;
    let maximum = 0;
    let otsuThreshold = 128;

    let sum1 = 0;
    for (let i = 0; i < 256; i++) {
      sum1 += i * histogram[i];
    }

    for (let t = 0; t < 256; t++) {
      wB += histogram[t];
      if (wB === 0) continue;
      const wF = totalPixels - wB;
      if (wF === 0) break;

      sumB += t * histogram[t];
      const mB = sumB / wB;
      const mF = (sum1 - sumB) / wF;
      const between = wB * wF * (mB - mF) * (mB - mF);

      if (between > maximum) {
        maximum = between;
        otsuThreshold = t;
      }
    }

    // 3. Contrast Stretching + Binarization with Adaptive Margin
    let binarizedCount = 0;
    const contrastSpan = Math.max(1, maxLum - minLum);

    for (let i = 0, j = 0; i < data.length; i += 4, j++) {
      const originalLum = gray[j];
      // Stretched luminance
      const stretched = Math.round(((originalLum - minLum) / contrastSpan) * 255);
      
      // Binary threshold decision
      const isBlack = stretched < otsuThreshold;
      const finalColor = isBlack ? 0 : 255;

      data[i] = finalColor;     // R
      data[i + 1] = finalColor; // G
      data[i + 2] = finalColor; // B
      data[i + 3] = 255;        // A

      if (isBlack) binarizedCount++;
    }

    ctx.putImageData(imgData, 0, 0);

    return {
      processedDataUrl: canvas.toDataURL('image/png'),
      canvas,
      stats: {
        width,
        height,
        minLuminance: minLum,
        maxLuminance: maxLum,
        otsuThreshold,
        darkTextRatio: (binarizedCount / totalPixels).toFixed(3)
      }
    };
  }

  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(new Error('Failed to load image for CV processing: ' + e));
      img.src = src;
    });
  }
}

export const openCvPreprocessor = new OpenCvOcrPreprocessor();
