import React, { useState, useReducer, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Toolbar } from './components/Toolbar';
import { PropertiesPanel } from './components/PropertiesPanel';
import { Canvas } from './components/Canvas';
import { Icon } from './components/Icon';
import { LayerItem } from './components/LayerItem';
import { Layer, LayerType, TextLayer, ImageLayer } from './types';
import { DEFAULT_CANVAS_SIZE } from './constants';
import { exportCanvas } from './utils/export';

function App() {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>([]);
  const [zoom, setZoom] = useState(0.6);
  const [showGrid, setShowGrid] = useState(false);
  const [showLayersPanel, setShowLayersPanel] = useState(true);
  
  // Basic History
  const [history, setHistory] = useState<Layer[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const addToHistory = useCallback((newLayers: Layer[]) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newLayers);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const updateLayers = (newLayers: Layer[], addToStack = true) => {
      setLayers(newLayers);
      if (addToStack) addToHistory(newLayers);
  };

  const undo = () => {
      if (historyIndex > 0) {
          const prevLayers = history[historyIndex - 1];
          setLayers(prevLayers);
          setHistoryIndex(historyIndex - 1);
      }
  };

  const redo = () => {
      if (historyIndex < history.length - 1) {
          const nextLayers = history[historyIndex + 1];
          setLayers(nextLayers);
          setHistoryIndex(historyIndex + 1);
      }
  };

  const handleAddText = (text: string) => {
    const newLayer: TextLayer = {
      id: uuidv4(),
      type: LayerType.TEXT,
      name: 'Text',
      text,
      x: DEFAULT_CANVAS_SIZE.width / 2 - 200,
      y: DEFAULT_CANVAS_SIZE.height / 2 - 50,
      width: 400,
      height: 100,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      fontFamily: '"Anton", sans-serif',
      fontSize: 80,
      fontWeight: 'bold',
      fontStyle: 'normal',
      textDecoration: 'none',
      color: '#ffffff',
      textAlign: 'center',
      letterSpacing: 0,
      lineHeight: 1.2,
      strokeColor: '#000000',
      strokeWidth: 0,
      glowSettings: { enabled: false, color: '#0ea5e9', size: 10, intensity: 0.8 },
      backdropType: 'none',
      backgroundPadding: 0,
      backgroundRadius: 0,
      backgroundOpacity: 1
    };
    const newLayers = [...layers, newLayer];
    updateLayers(newLayers);
    setSelectedLayerIds([newLayer.id]);
  };

  const handleAddImage = (src: string, width?: number, height?: number) => {
    // Default size if not provided
    let initialWidth = width || 600;
    let initialHeight = height || 400;

    // Smart scaling: If image is massive, scale it down to fit reasonably within the view
    // Let's say max 80% of the canvas size
    const maxDimension = Math.min(DEFAULT_CANVAS_SIZE.width, DEFAULT_CANVAS_SIZE.height) * 0.8;
    
    if (initialWidth > maxDimension || initialHeight > maxDimension) {
        const ratio = Math.min(maxDimension / initialWidth, maxDimension / initialHeight);
        initialWidth *= ratio;
        initialHeight *= ratio;
    }

    const newLayer: ImageLayer = {
      id: uuidv4(),
      type: LayerType.IMAGE,
      name: 'Image',
      src,
      x: (DEFAULT_CANVAS_SIZE.width - initialWidth) / 2,
      y: (DEFAULT_CANVAS_SIZE.height - initialHeight) / 2,
      width: initialWidth,
      height: initialHeight,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      flipX: false,
      flipY: false,
      gradientOverlay: { enabled: false, colors: ['transparent', 'black'], direction: 180, opacity: 0.5 },
      glowSettings: { enabled: false, color: '#0ea5e9', size: 20, intensity: 1 },
      filters: {
        brightness: 100,
        contrast: 100,
        saturate: 100,
        grayscale: 0,
        blur: 0,
        sepia: 0
      }
    };
    const newLayers = [...layers, newLayer];
    updateLayers(newLayers);
    setSelectedLayerIds([newLayer.id]);
  };

  const handleUpdateLayer = (id: string, updates: Partial<Layer>) => {
    const newLayers = layers.map(l => l.id === id ? { ...l, ...updates } : l);
    // Debounce history for drag? For now, we update state directly and maybe throttle history in a real app
    // Here we just update state. Real history mgmt usually waits for drag end.
    setLayers(newLayers);
  };

  const handleDeleteLayer = (id: string) => {
    const newLayers = layers.filter(l => l.id !== id);
    updateLayers(newLayers);
    setSelectedLayerIds([]);
  };

  const handleDuplicateLayer = (id: string) => {
    const layer = layers.find(l => l.id === id);
    if (layer) {
        const newLayer = { ...layer, id: uuidv4(), x: layer.x + 20, y: layer.y + 20, name: layer.name + ' (Copy)' };
        updateLayers([...layers, newLayer]);
        setSelectedLayerIds([newLayer.id]);
    }
  };

  const handleMoveLayer = (id: string, direction: 'up' | 'down' | 'front' | 'back') => {
      const idx = layers.findIndex(l => l.id === id);
      if (idx === -1) return;
      
      const newLayers = [...layers];
      const layer = newLayers[idx];
      newLayers.splice(idx, 1);
      
      if (direction === 'front') newLayers.push(layer);
      else if (direction === 'back') newLayers.unshift(layer);
      else if (direction === 'up') newLayers.splice(Math.min(idx + 1, newLayers.length), 0, layer);
      else if (direction === 'down') newLayers.splice(Math.max(idx - 1, 0), 0, layer);
      
      updateLayers(newLayers);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
            e.preventDefault();
            undo();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
            e.preventDefault();
            redo();
        }
        if (e.key === 'Delete' && selectedLayerIds.length > 0) {
            handleDeleteLayer(selectedLayerIds[0]);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [layers, selectedLayerIds, historyIndex]);

  const selectedLayer = layers.find(l => l.id === selectedLayerIds[0]) || null;

  return (
    <div className="flex flex-col h-screen w-screen bg-[#121212] text-white">
      {/* Top Header */}
      <header className="h-14 bg-panel border-b border-gray-700 flex items-center justify-between px-4 shrink-0 z-30">
         <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-brand-500 rounded flex items-center justify-center font-bold text-lg">L</div>
             <span className="font-semibold tracking-tight">Lumina Studio</span>
         </div>

         <div className="flex items-center gap-4">
             <div className="flex bg-gray-800 rounded-lg p-1 gap-1">
                 <button onClick={undo} disabled={historyIndex <= 0} className="p-1.5 hover:bg-gray-700 rounded disabled:opacity-30"><Icon name="Undo" size={16} /></button>
                 <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-1.5 hover:bg-gray-700 rounded disabled:opacity-30"><Icon name="Redo" size={16} /></button>
             </div>
             
             <div className="h-6 w-px bg-gray-700"></div>

             <div className="flex items-center gap-2">
                 <button onClick={() => setZoom(z => Math.max(0.1, z - 0.1))} className="p-1.5 hover:bg-gray-800 rounded"><Icon name="Minus" size={16} /></button>
                 <span className="text-xs font-mono w-12 text-center">{Math.round(zoom * 100)}%</span>
                 <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-1.5 hover:bg-gray-800 rounded"><Icon name="Plus" size={16} /></button>
             </div>
         </div>

         <div className="flex items-center gap-3">
             <button onClick={() => setShowGrid(!showGrid)} className={`p-2 rounded ${showGrid ? 'bg-brand-900 text-brand-400' : 'hover:bg-gray-800'}`} title="Toggle Grid"><Icon name="Grid" size={18} /></button>
             <button onClick={() => exportCanvas('canvas-container', 'png')} className="px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded-lg text-sm font-semibold shadow-lg shadow-brand-900/50 flex items-center gap-2">
                 <Icon name="Download" size={16} /> Export
             </button>
         </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
         <Toolbar 
            onAddText={handleAddText} 
            onAddImage={handleAddImage} 
         />
         
         {/* Canvas Area */}
         <div className="flex-1 bg-[#1e1e1e] overflow-auto flex items-center justify-center p-8 relative">
             <div className="relative shadow-2xl">
                <Canvas 
                    layers={layers}
                    canvasSize={DEFAULT_CANVAS_SIZE}
                    zoom={zoom}
                    selectedLayerIds={selectedLayerIds}
                    onSelectLayer={(id, multi) => setSelectedLayerIds(id ? [id] : [])}
                    onUpdateLayer={handleUpdateLayer}
                    showGrid={showGrid}
                />
             </div>
         </div>

         {/* Right Panel (Properties + Layers) */}
         <div className="flex flex-col h-full bg-panel border-l border-gray-700 shrink-0 w-80">
             
             {/* Properties (Top Half) */}
             <div className="flex-1 overflow-hidden flex flex-col border-b border-gray-700">
                <PropertiesPanel 
                    selectedLayer={selectedLayer}
                    onUpdateLayer={handleUpdateLayer}
                    onDeleteLayer={handleDeleteLayer}
                    onMoveLayer={handleMoveLayer}
                    onDuplicateLayer={handleDuplicateLayer}
                />
             </div>

             {/* Layers Panel (Bottom Half) */}
             <div className={`flex flex-col ${showLayersPanel ? 'h-1/3' : 'h-10'} transition-all duration-300`}>
                 <div 
                    className="h-10 bg-gray-800 flex items-center justify-between px-4 cursor-pointer hover:bg-gray-750"
                    onClick={() => setShowLayersPanel(!showLayersPanel)}
                 >
                     <span className="text-xs font-bold uppercase text-gray-400">Layers</span>
                     <Icon name={showLayersPanel ? 'ChevronDown' : 'ChevronUp'} size={14} className="text-gray-500" />
                 </div>
                 {showLayersPanel && (
                     <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                         {layers.slice().reverse().map(layer => (
                             <LayerItem 
                                key={layer.id}
                                layer={layer}
                                isSelected={selectedLayerIds.includes(layer.id)}
                                onSelect={() => setSelectedLayerIds([layer.id])}
                                onToggleVisibility={() => handleUpdateLayer(layer.id, { visible: !layer.visible })}
                                onToggleLock={() => handleUpdateLayer(layer.id, { locked: !layer.locked })}
                             />
                         ))}
                         {layers.length === 0 && <p className="text-center text-gray-600 text-xs mt-4">No layers</p>}
                     </div>
                 )}
             </div>
         </div>
      </div>
    </div>
  );
}

export default App;