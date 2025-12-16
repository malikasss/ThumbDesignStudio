import React, { useRef, useState, useEffect } from 'react';
import { Layer, LayerType, TextLayer, ImageLayer } from '../types';

interface CanvasProps {
    layers: Layer[];
    canvasSize: { width: number; height: number };
    zoom: number;
    selectedLayerIds: string[];
    onSelectLayer: (id: string, multi: boolean) => void;
    onUpdateLayer: (id: string, updates: Partial<Layer>) => void;
    showGrid: boolean;
}

export const Canvas: React.FC<CanvasProps> = ({ 
    layers, 
    canvasSize, 
    zoom, 
    selectedLayerIds, 
    onSelectLayer, 
    onUpdateLayer,
    showGrid
}) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [initialLayerPos, setInitialLayerPos] = useState({ x: 0, y: 0 });
    const [activeOperation, setActiveOperation] = useState<'move' | 'resize' | 'rotate' | null>(null);

    // Helpers to handle coordinate conversion
    const getMousePos = (e: React.MouseEvent | MouseEvent) => {
        if (!canvasRef.current) return { x: 0, y: 0 };
        const rect = canvasRef.current.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) / zoom,
            y: (e.clientY - rect.top) / zoom
        };
    };

    const handleMouseDown = (e: React.MouseEvent, layerId: string) => {
        e.stopPropagation();
        const layer = layers.find(l => l.id === layerId);
        if (!layer || layer.locked) return;

        const isSelected = selectedLayerIds.includes(layerId);
        if (!isSelected) {
            onSelectLayer(layerId, e.shiftKey);
        }

        setActiveOperation('move');
        setIsDragging(true);
        const pos = getMousePos(e);
        setDragStart(pos);
        setInitialLayerPos({ x: layer.x, y: layer.y });
    };

    const handleCanvasMouseDown = (e: React.MouseEvent) => {
        if (e.target === canvasRef.current) {
             onSelectLayer('', false);
        }
    };
    
    // Global mouse move/up handlers
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !activeOperation) return;
            
            const currentPos = getMousePos(e);
            
            if (activeOperation === 'move' && selectedLayerIds.length === 1) {
                const layer = layers.find(l => l.id === selectedLayerIds[0]);
                if (layer) {
                    const dx = currentPos.x - dragStart.x;
                    const dy = currentPos.y - dragStart.y;
                    
                    onUpdateLayer(layer.id, {
                        x: initialLayerPos.x + dx,
                        y: initialLayerPos.y + dy
                    });
                }
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setActiveOperation(null);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, activeOperation, dragStart, initialLayerPos, layers, selectedLayerIds, onUpdateLayer, zoom]);

    const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    return (
        <div 
            id="canvas-container"
            className="bg-white shadow-2xl relative overflow-hidden transition-transform duration-200 ease-out origin-top-left"
            style={{ 
                width: canvasSize.width, 
                height: canvasSize.height,
                transform: `scale(${zoom})`,
                backgroundImage: showGrid ? 'linear-gradient(to right, #ddd 1px, transparent 1px), linear-gradient(to bottom, #ddd 1px, transparent 1px)' : 'none',
                backgroundSize: '40px 40px'
            }}
            ref={canvasRef}
            onMouseDown={handleCanvasMouseDown}
        >
            {layers.map((layer) => {
                if (!layer.visible) return null;
                const isSelected = selectedLayerIds.includes(layer.id);
                const isText = layer.type === LayerType.TEXT;
                
                // Helper for glow
                const glow = layer.glowSettings;
                const glowStyle = glow?.enabled 
                    ? (isText ? `0 0 ${glow.size}px ${hexToRgba(glow.color, glow.intensity)}` : `drop-shadow(0 0 ${glow.size}px ${hexToRgba(glow.color, glow.intensity)})`)
                    : undefined;

                const style: React.CSSProperties = {
                    position: 'absolute',
                    left: layer.x,
                    top: layer.y,
                    width: layer.width,
                    height: isText ? 'auto' : layer.height,
                    transform: `rotate(${layer.rotation}deg)`,
                    opacity: layer.opacity,
                    cursor: layer.locked ? 'default' : (activeOperation === 'move' && isSelected ? 'grabbing' : 'grab'),
                    border: isSelected ? '2px solid #0ea5e9' : '2px solid transparent',
                    zIndex: isSelected ? 100 : 1, 
                    overflow: 'hidden', // Important for cropping
                };

                // Text Backdrop Styles
                let textBackdropStyle: React.CSSProperties = {};
                if (layer.type === LayerType.TEXT) {
                    const textLayer = layer as TextLayer;
                    const bgColor = textLayer.backgroundColor ? hexToRgba(textLayer.backgroundColor, textLayer.backgroundOpacity) : 'transparent';
                    
                    switch (textLayer.backdropType) {
                        case 'solid':
                            textBackdropStyle = { backgroundColor: bgColor };
                            break;
                        case 'soft':
                            textBackdropStyle = { 
                                backgroundColor: 'transparent',
                                boxShadow: `0 0 20px 5px ${bgColor}, 0 0 10px 0px ${bgColor}` // Soft brush effect
                            };
                            break;
                        case 'glass':
                            textBackdropStyle = { 
                                backgroundColor: bgColor, 
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            };
                            break;
                        case 'neon':
                            textBackdropStyle = {
                                backgroundColor: hexToRgba(textLayer.backgroundColor || '#000', Math.min(textLayer.backgroundOpacity, 0.3)),
                                border: `2px solid ${textLayer.backgroundColor || '#0ff'}`,
                                boxShadow: `0 0 10px ${textLayer.backgroundColor || '#0ff'}, inset 0 0 10px ${textLayer.backgroundColor || '#0ff'}`
                            };
                            break;
                        case 'rough':
                             textBackdropStyle = {
                                backgroundColor: bgColor,
                                clipPath: 'polygon(5% 5%, 100% 0%, 100% 90%, 0% 100%)' // Simple jagged paper
                             };
                             break;
                        case 'carbon':
                            textBackdropStyle = {
                                backgroundColor: '#131313',
                                backgroundImage: `
                                    linear-gradient(27deg, #151515 5px, transparent 5px),
                                    linear-gradient(201deg, #151515 5px, transparent 5px),
                                    linear-gradient(24deg, #222 5px, transparent 5px),
                                    linear-gradient(204deg, #222 5px, transparent 5px),
                                    linear-gradient(27deg, #353535 5px, transparent 5px),
                                    linear-gradient(201deg, #353535 5px, transparent 5px),
                                    linear-gradient(24deg, #111 5px, transparent 5px),
                                    linear-gradient(204deg, #111 5px, transparent 5px)
                                `,
                                backgroundSize: '20px 20px',
                                backgroundPosition: '0 5px, 10px 10px, 0 0, 10px 5px, 0 5px, 10px 10px, 0 0, 10px 5px',
                                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8), 0 4px 6px rgba(0,0,0,0.5)',
                                border: '1px solid #333'
                            };
                            break;
                         case 'scanline':
                            textBackdropStyle = {
                                backgroundColor: bgColor,
                                backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.5) 50%)',
                                backgroundSize: '100% 4px',
                                borderLeft: `4px solid ${textLayer.color.startsWith('linear') ? '#fff' : textLayer.color}`
                            };
                            break;
                        default:
                            textBackdropStyle = {};
                    }
                }

                // Image Crop logic
                let imageStyle: React.CSSProperties = {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: `scaleX(${(layer as ImageLayer).flipX ? -1 : 1}) scaleY(${(layer as ImageLayer).flipY ? -1 : 1})`,
                    filter: (layer.type === LayerType.IMAGE) 
                        ? `brightness(${(layer as ImageLayer).filters?.brightness}%) contrast(${(layer as ImageLayer).filters?.contrast}%) saturate(${(layer as ImageLayer).filters?.saturate}%) grayscale(${(layer as ImageLayer).filters?.grayscale}%) blur(${(layer as ImageLayer).filters?.blur}px) sepia(${(layer as ImageLayer).filters?.sepia}%) ${glow?.enabled ? glowStyle : ''}` 
                        : undefined,
                    pointerEvents: 'none'
                };

                if (layer.type === LayerType.IMAGE && (layer as ImageLayer).crop) {
                    const crop = (layer as ImageLayer).crop!;
                    imageStyle = {
                        ...imageStyle,
                        width: `${(1 / crop.width) * 100}%`,
                        height: `${(1 / crop.height) * 100}%`,
                        position: 'absolute',
                        left: `${(-crop.x / crop.width) * 100}%`,
                        top: `${(-crop.y / crop.height) * 100}%`,
                        objectFit: 'fill', // Stretch to the calculated frame
                    };
                }

                return (
                   <div
                      key={layer.id}
                      style={{...style, zIndex: undefined}}
                      onMouseDown={(e) => handleMouseDown(e, layer.id)}
                      className="group"
                   >
                       {/* Resize Handles (Simplified for demo) */}
                       {isSelected && !layer.locked && (
                           <>
                              <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full" />
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
                              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full" />
                              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
                           </>
                       )}

                       {layer.type === LayerType.IMAGE && (
                           <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                               <img 
                                   src={(layer as ImageLayer).src} 
                                   alt="layer"
                                   style={imageStyle}
                                   draggable={false}
                               />
                               {(layer as ImageLayer).gradientOverlay?.enabled && (
                                   <div 
                                      className="absolute inset-0 pointer-events-none"
                                      style={{
                                          background: `linear-gradient(${(layer as ImageLayer).gradientOverlay!.direction}deg, ${(layer as ImageLayer).gradientOverlay!.colors[0]}, ${(layer as ImageLayer).gradientOverlay!.colors[1]})`,
                                          opacity: (layer as ImageLayer).gradientOverlay!.opacity,
                                      }}
                                   />
                               )}
                           </div>
                       )}

                       {layer.type === LayerType.TEXT && (
                           <div style={{
                               fontFamily: (layer as TextLayer).fontFamily,
                               fontSize: `${(layer as TextLayer).fontSize}px`,
                               color: (layer as TextLayer).color.startsWith('linear') ? 'transparent' : (layer as TextLayer).color,
                               backgroundImage: (layer as TextLayer).color.startsWith('linear') ? (layer as TextLayer).color : 'none',
                               backgroundClip: (layer as TextLayer).color.startsWith('linear') ? 'text' : 'border-box',
                               WebkitBackgroundClip: (layer as TextLayer).color.startsWith('linear') ? 'text' : 'border-box',
                               textAlign: (layer as TextLayer).textAlign,
                               fontWeight: 'bold', 
                               whiteSpace: 'pre-wrap',
                               width: '100%',
                               lineHeight: 1.2,
                               // Outline
                               WebkitTextStroke: (layer as TextLayer).strokeWidth > 0 ? `${(layer as TextLayer).strokeWidth}px ${(layer as TextLayer).strokeColor}` : undefined,
                               // Glow
                               textShadow: glow?.enabled ? glowStyle : undefined,
                               // Backdrop Settings
                               padding: `${(layer as TextLayer).backgroundPadding}px`,
                               borderRadius: `${(layer as TextLayer).backgroundRadius}px`,
                               ...textBackdropStyle
                           }}>
                               {(layer as TextLayer).text}
                           </div>
                       )}
                   </div>
                );
            })}
        </div>
    );
};