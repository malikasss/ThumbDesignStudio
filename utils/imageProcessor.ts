
export const removeBackground = (imageSrc: string, tolerance: number = 30): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject("No context");
                return;
            }
            ctx.drawImage(img, 0, 0);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // Assume the top-left pixel is the background color
            const r0 = data[0];
            const g0 = data[1];
            const b0 = data[2];

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                // Calculate distance
                const dist = Math.sqrt(
                    (r - r0) ** 2 + 
                    (g - g0) ** 2 + 
                    (b - b0) ** 2
                );

                if (dist < tolerance) {
                    data[i + 3] = 0; // Set alpha to 0
                }
            }

            ctx.putImageData(imageData, 0, 0);
            resolve(canvas.toDataURL());
        };
        img.onerror = reject;
        img.src = imageSrc;
    });
};
