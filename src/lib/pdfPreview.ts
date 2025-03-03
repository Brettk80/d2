import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist';

// Configure worker source - using CDN for reliability
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;

interface PreviewResult {
  dataUrl: string;
  pageCount: number;
}

export async function createPdfPreview(file: File, pageNumber: number = 1): Promise<PreviewResult> {
  try {
    // Validate file type
    if (!file || file.type !== 'application/pdf') {
      throw new Error('Invalid file type. Expected PDF.');
    }

    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error('Empty or invalid file');
    }

    // Load the PDF document
    const loadingTask = getDocument({
      data: arrayBuffer,
      cMapUrl: '//cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
      cMapPacked: true,
      standardFontDataUrl: '//cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/standard_fonts/'
    });

    // Handle password-protected PDFs
    loadingTask.onPassword = () => {
      throw new Error('Password protected PDFs are not supported');
    };

    // Load PDF document
    const pdf = await loadingTask.promise;
    const totalPages = pdf.numPages;

    // Validate page number
    if (pageNumber < 1 || pageNumber > totalPages) {
      throw new Error(`Invalid page number. Document has ${totalPages} pages.`);
    }

    // Get specific page
    const page = await pdf.getPage(pageNumber);
    
    // Calculate viewport with a scale that provides good quality
    const viewport = page.getViewport({ scale: 1.5 });

    // Create canvas with proper dimensions
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const context = canvas.getContext('2d', { 
      alpha: false,
      willReadFrequently: true // Optimize for frequent pixel reads
    });

    if (!context) {
      throw new Error('Could not create canvas context');
    }

    // Set white background
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Render PDF page
    try {
      await page.render({
        canvasContext: context,
        viewport: viewport,
        background: 'white',
        enableWebGL: true // Enable WebGL rendering if available
      }).promise;

      // Convert to JPEG with good quality
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

      return {
        dataUrl,
        pageCount: totalPages
      };
    } catch (renderError) {
      console.error('PDF rendering error:', renderError);
      throw new Error('Failed to render PDF page');
    }
  } catch (error) {
    console.error('PDF preview error:', error);
    throw error instanceof Error ? error : new Error('Unknown PDF processing error');
  }
}
