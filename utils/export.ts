import html2canvas from 'html2canvas';

export const exportCanvas = async (elementId: string, format: 'png' | 'jpeg', quality: number = 0.9) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // Temporarily hide handles/grid if any exist outside
    const canvas = await html2canvas(element, {
        backgroundColor: null, // Transparent if PNG
        scale: 1, // Capture at 1:1 of the defined px dimensions, assuming element is scaled via CSS transform
        useCORS: true,
        logging: false,
    });
    
    const link = document.createElement('a');
    link.download = `lumina-design-${Date.now()}.${format}`;
    link.href = canvas.toDataURL(`image/${format}`, quality);
    link.click();
};
