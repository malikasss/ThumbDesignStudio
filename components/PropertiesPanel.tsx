import React from 'react';
import { Layer, LayerType, TextLayer, ImageLayer } from '../types';
import { FONTS, TEXT_GRADIENTS, IMAGE_GRADIENTS, BACKDROP_PRESETS } from '../constants';
import { Icon } from './Icon';

interface PropertiesPanelProps {
  selectedLayer: Layer | null;
  onUpdateLayer: (id: string, updates: Partial<Layer>) => void;
  onDeleteLayer: (id: string) => void;
  onMoveLayer: (id: string, direction: 'up' | 'down' | 'front' | 'back') => void;
  onDuplicateLayer: (id: string) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ 
  selectedLayer, 
  onUpdateLayer,
  onDeleteLayer,
  onMoveLayer,
  onDuplicateLayer
}) => {

  if (!selectedLayer) {
    return (
      <div className="w-80 bg-panel border-l border-gray-700 p-6 flex flex-col items-center justify-center text-gray-500 text-sm">
        <Icon name="MousePointer2" size={48} className="mb-4 opacity-50" />
        <p>Select an element to edit</p>
      </div>
    );
  }

  const isText = selectedLayer.type === LayerType.TEXT;
  const isImage = selectedLayer.type === LayerType.IMAGE;

  return (
    <div className="w-80 bg-panel border-l border-gray-700 flex flex-col h-full overflow-y-auto shrink-0 z-20 custom-scrollbar">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
        <h2 className="font-semibold text-white text-sm uppercase tracking-wider">Properties</h2>
        <div className="flex gap-2">
           <button title="Duplicate" onClick={() => onDuplicateLayer(selectedLayer.id)} className="p-1.5 hover:bg-gray-700 rounded text-gray-300"><Icon name="Copy" size={16} /></button>
           <button title="Delete" onClick={() => onDeleteLayer(selectedLayer.id)} className="p-1.5 hover:bg-red-900/50 hover:text-red-400 rounded text-gray-300"><Icon name="Trash2" size={16} /></button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        
        {/* Common Layout */}
        <section className="space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase">Layout</h3>
            
            {/* Size & Dimensions (Sizing) */}
            <div className="grid grid-cols-2 gap-3 mb-2">
                <div className="bg-gray-800 p-2 rounded flex flex-col gap-1">
                    <label className="text-[10px] text-gray-500">Width</label>
                    <input 
                        type="number" 
                        value={Math.round(selectedLayer.width)}
                        onChange={(e) => onUpdateLayer(selectedLayer.id, { width: parseInt(e.target.value) })}
                        className="bg-transparent text-white text-sm w-full outline-none"
                    />
                </div>
                 <div className="bg-gray-800 p-2 rounded flex flex-col gap-1">
                    <label className="text-[10px] text-gray-500">Height</label>
                    <input 
                        type="number" 
                        value={Math.round(selectedLayer.height)}
                        onChange={(e) => onUpdateLayer(selectedLayer.id, { height: parseInt(e.target.value) })}
                        className="bg-transparent text-white text-sm w-full outline-none"
                        disabled={isText} // Text height is auto-calculated usually
                    />
                </div>
                 <div className="bg-gray-800 p-2 rounded flex flex-col gap-1">
                    <label className="text-[10px] text-gray-500">X Pos</label>
                    <input 
                        type="number" 
                        value={Math.round(selectedLayer.x)}
                        onChange={(e) => onUpdateLayer(selectedLayer.id, { x: parseInt(e.target.value) })}
                        className="bg-transparent text-white text-sm w-full outline-none"
                    />
                </div>
                 <div className="bg-gray-800 p-2 rounded flex flex-col gap-1">
                    <label className="text-[10px] text-gray-500">Y Pos</label>
                    <input 
                        type="number" 
                        value={Math.round(selectedLayer.y)}
                        onChange={(e) => onUpdateLayer(selectedLayer.id, { y: parseInt(e.target.value) })}
                        className="bg-transparent text-white text-sm w-full outline-none"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800 p-2 rounded flex flex-col gap-1">
                    <label className="text-[10px] text-gray-500">Opacity</label>
                    <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.01"
                        value={selectedLayer.opacity}
                        onChange={(e) => onUpdateLayer(selectedLayer.id, { opacity: parseFloat(e.target.value) })}
                        className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                <div className="bg-gray-800 p-2 rounded flex flex-col gap-1">
                    <label className="text-[10px] text-gray-500">Rotation</label>
                    <div className="flex items-center gap-2">
                         <input 
                            type="number"
                            value={Math.round(selectedLayer.rotation)}
                            onChange={(e) => onUpdateLayer(selectedLayer.id, { rotation: parseFloat(e.target.value) })}
                            className="bg-transparent text-white text-sm w-full outline-none"
                         />
                         <span className="text-gray-500 text-xs">deg</span>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
                <button onClick={() => onMoveLayer(selectedLayer.id, 'front')} className="p-2 bg-gray-800 rounded hover:bg-gray-700 flex justify-center" title="Bring to Front"><Icon name="ArrowUpToLine" size={16} /></button>
                <button onClick={() => onMoveLayer(selectedLayer.id, 'up')} className="p-2 bg-gray-800 rounded hover:bg-gray-700 flex justify-center" title="Bring Forward"><Icon name="ArrowUp" size={16} /></button>
                <button onClick={() => onMoveLayer(selectedLayer.id, 'down')} className="p-2 bg-gray-800 rounded hover:bg-gray-700 flex justify-center" title="Send Backward"><Icon name="ArrowDown" size={16} /></button>
                <button onClick={() => onMoveLayer(selectedLayer.id, 'back')} className="p-2 bg-gray-800 rounded hover:bg-gray-700 flex justify-center" title="Send to Back"><Icon name="ArrowDownToLine" size={16} /></button>
            </div>
        </section>

        {/* Text Specific */}
        {isText && (
          <section className="space-y-4 pt-4 border-t border-gray-700">
            <h3 className="text-xs font-bold text-gray-400 uppercase">Text Editing</h3>
            
            <textarea 
                value={(selectedLayer as TextLayer).text} 
                onChange={(e) => onUpdateLayer(selectedLayer.id, { text: e.target.value })}
                className="w-full bg-gray-800 text-white rounded p-2 text-sm border border-gray-700 focus:border-brand-500 outline-none resize-none"
                rows={3}
            />

            <div className="space-y-2">
                <select 
                    value={(selectedLayer as TextLayer).fontFamily}
                    onChange={(e) => onUpdateLayer(selectedLayer.id, { fontFamily: e.target.value })}
                    className="w-full bg-gray-800 text-white rounded p-2 text-sm outline-none border border-gray-700"
                >
                    {FONTS.map(f => <option key={f.name} value={f.value}>{f.name}</option>)}
                </select>

                <div className="flex gap-2">
                    <input 
                        type="color" 
                        value={(selectedLayer as TextLayer).color.startsWith('linear') ? '#ffffff' : (selectedLayer as TextLayer).color}
                        onChange={(e) => onUpdateLayer(selectedLayer.id, { color: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer bg-transparent border-none p-0"
                    />
                    <input 
                        type="number" 
                        value={(selectedLayer as TextLayer).fontSize}
                        onChange={(e) => onUpdateLayer(selectedLayer.id, { fontSize: parseInt(e.target.value) })}
                        className="flex-1 bg-gray-800 text-white rounded p-2 text-sm outline-none border border-gray-700"
                        placeholder="Size"
                    />
                </div>
            </div>

            <div className="flex gap-2">
                 {['left', 'center', 'right'].map((align) => (
                     <button 
                        key={align}
                        onClick={() => onUpdateLayer(selectedLayer.id, { textAlign: align as any })}
                        className={`p-2 rounded flex-1 flex justify-center ${ (selectedLayer as TextLayer).textAlign === align ? 'bg-brand-600 text-white' : 'bg-gray-800 text-gray-400'}`}
                     >
                         <Icon name={`Align${align.charAt(0).toUpperCase() + align.slice(1)}` as any} size={16} />
                     </button>
                 ))}
            </div>

            {/* Gradient Text */}
            <div>
                <label className="text-[10px] text-gray-500 mb-1 block">Text Gradient</label>
                <div className="grid grid-cols-4 gap-2">
                    <button 
                         onClick={() => onUpdateLayer(selectedLayer.id, { color: '#ffffff' })}
                         className="w-full h-8 rounded border border-gray-600 bg-white"
                         title="None"
                    />
                    {TEXT_GRADIENTS.map((g, i) => (
                         <button 
                             key={i}
                             onClick={() => onUpdateLayer(selectedLayer.id, { color: g.value })}
                             className="w-full h-8 rounded border border-gray-600"
                             style={{ background: g.value }}
                             title={g.name}
                         />
                    ))}
                </div>
            </div>

             {/* Text Effects Section */}
             <div className="space-y-4 border-t border-gray-700 pt-3">
                 <h3 className="text-xs font-bold text-gray-400 uppercase">Text Effects</h3>
                 
                 {/* Outline Control */}
                 <div className="bg-gray-800 p-2 rounded space-y-2">
                     <div className="flex justify-between items-center">
                         <span className="text-[10px] text-gray-400">Outline</span>
                         <input 
                             type="checkbox"
                             checked={(selectedLayer as TextLayer).strokeWidth > 0}
                             onChange={(e) => onUpdateLayer(selectedLayer.id, { strokeWidth: e.target.checked ? 2 : 0 })}
                         />
                     </div>
                     {(selectedLayer as TextLayer).strokeWidth > 0 && (
                         <div className="flex gap-2 items-center">
                             <input 
                                 type="color"
                                 value={(selectedLayer as TextLayer).strokeColor || '#000000'}
                                 onChange={(e) => onUpdateLayer(selectedLayer.id, { strokeColor: e.target.value })}
                                 className="w-6 h-6 rounded border-none bg-transparent shrink-0"
                             />
                             <div className="flex-1">
                                 <input 
                                     type="range" min="1" max="10" step="0.5"
                                     value={(selectedLayer as TextLayer).strokeWidth}
                                     onChange={(e) => onUpdateLayer(selectedLayer.id, { strokeWidth: parseFloat(e.target.value) })}
                                     className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                 />
                             </div>
                         </div>
                     )}
                 </div>

                 {/* Glow Control */}
                 <div className="bg-gray-800 p-2 rounded space-y-2">
                     <div className="flex justify-between items-center">
                         <span className="text-[10px] text-gray-400">Glow</span>
                         <input 
                             type="checkbox"
                             checked={!!selectedLayer.glowSettings?.enabled}
                             onChange={(e) => onUpdateLayer(selectedLayer.id, { 
                                 glowSettings: { 
                                     ...(selectedLayer.glowSettings || { color: '#0ea5e9', size: 10, intensity: 1 }), 
                                     enabled: e.target.checked 
                                 } 
                             })}
                         />
                     </div>
                     {selectedLayer.glowSettings?.enabled && (
                         <div className="space-y-2">
                             <div className="flex gap-2 items-center">
                                 <input 
                                     type="color"
                                     value={selectedLayer.glowSettings.color}
                                     onChange={(e) => onUpdateLayer(selectedLayer.id, { 
                                         glowSettings: { ...selectedLayer.glowSettings!, color: e.target.value } 
                                     })}
                                     className="w-6 h-6 rounded border-none bg-transparent shrink-0"
                                 />
                                 <div className="flex-1 space-y-1">
                                    <div className="flex justify-between text-[8px] text-gray-500">
                                        <span>Size</span>
                                        <span>Intensity</span>
                                    </div>
                                    <div className="flex gap-2">
                                         <input 
                                             type="range" min="1" max="100" step="1"
                                             value={selectedLayer.glowSettings.size}
                                             onChange={(e) => onUpdateLayer(selectedLayer.id, { 
                                                 glowSettings: { ...selectedLayer.glowSettings!, size: parseInt(e.target.value) } 
                                             })}
                                             className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                         />
                                         <input 
                                             type="range" min="0" max="1" step="0.1"
                                             value={selectedLayer.glowSettings.intensity}
                                             onChange={(e) => onUpdateLayer(selectedLayer.id, { 
                                                 glowSettings: { ...selectedLayer.glowSettings!, intensity: parseFloat(e.target.value) } 
                                             })}
                                             className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                         />
                                    </div>
                                 </div>
                             </div>
                         </div>
                     )}
                 </div>
             </div>

            {/* Backdrop Settings */}
             <div className="space-y-3 border-t border-gray-700 pt-3">
                 <h3 className="text-xs font-bold text-gray-400 uppercase">Text Backdrop</h3>
                 
                 <div className="flex gap-2 mb-2 overflow-x-auto pb-2 custom-scrollbar">
                    {BACKDROP_PRESETS.map((p, i) => (
                        <button 
                            key={i}
                            onClick={() => onUpdateLayer(selectedLayer.id, { 
                                backdropType: p.type,
                                backgroundColor: p.color, 
                                backgroundOpacity: p.opacity, 
                                backgroundPadding: p.padding, 
                                backgroundRadius: p.radius 
                            })}
                            className="flex-shrink-0 w-8 h-8 rounded border border-gray-600"
                            style={{ backgroundColor: p.color }}
                            title={p.name}
                        />
                    ))}
                    <button 
                        onClick={() => onUpdateLayer(selectedLayer.id, { backdropType: 'none', backgroundColor: undefined })} 
                        className="flex-shrink-0 w-8 h-8 rounded border border-gray-600 flex items-center justify-center text-red-400 text-xs"
                    >
                        None
                    </button>
                 </div>

                 {/* Numeral Inbox Settings */}
                 <div className="grid grid-cols-2 gap-2">
                     <div className="bg-gray-800 p-2 rounded">
                        <label className="text-[10px] text-gray-500 block mb-1">Padding</label>
                        <input 
                            type="number" 
                            className="w-full bg-transparent text-white text-sm outline-none"
                            value={(selectedLayer as TextLayer).backgroundPadding}
                            onChange={(e) => onUpdateLayer(selectedLayer.id, { backgroundPadding: Number(e.target.value) })}
                        />
                     </div>
                     <div className="bg-gray-800 p-2 rounded">
                        <label className="text-[10px] text-gray-500 block mb-1">Radius</label>
                        <input 
                            type="number" 
                            className="w-full bg-transparent text-white text-sm outline-none"
                            value={(selectedLayer as TextLayer).backgroundRadius}
                            onChange={(e) => onUpdateLayer(selectedLayer.id, { backgroundRadius: Number(e.target.value) })}
                        />
                     </div>
                      <div className="bg-gray-800 p-2 rounded col-span-2 flex items-center gap-2">
                        <label className="text-[10px] text-gray-500 shrink-0">Color</label>
                        <input 
                            type="color" 
                            className="w-6 h-6 rounded border-none bg-transparent"
                            value={(selectedLayer as TextLayer).backgroundColor || '#000000'}
                            onChange={(e) => onUpdateLayer(selectedLayer.id, { backgroundColor: e.target.value })}
                        />
                        <input 
                             type="range" min="0" max="1" step="0.1"
                             className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                             value={(selectedLayer as TextLayer).backgroundOpacity}
                             onChange={(e) => onUpdateLayer(selectedLayer.id, { backgroundOpacity: Number(e.target.value) })}
                        />
                     </div>
                 </div>
             </div>
          </section>
        )}

        {/* Image Specific */}
        {isImage && (
            <section className="space-y-4 pt-4 border-t border-gray-700">
                <h3 className="text-xs font-bold text-gray-400 uppercase">Image Tools</h3>

                 {/* CROP / CUT TOOL */}
                 <div className="bg-gray-800 p-3 rounded space-y-3">
                     <div className="flex justify-between items-center">
                         <span className="text-xs font-bold text-gray-300">Crop / Cut</span>
                         <input 
                             type="checkbox" 
                             checked={!!(selectedLayer as ImageLayer).crop}
                             onChange={(e) => {
                                 if (e.target.checked) {
                                     onUpdateLayer(selectedLayer.id, { crop: { x: 0, y: 0, width: 1, height: 1 } });
                                 } else {
                                     onUpdateLayer(selectedLayer.id, { crop: undefined });
                                 }
                             }}
                         />
                     </div>
                     {(selectedLayer as ImageLayer).crop && (
                        <div className="space-y-2">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] text-gray-500">Zoom / Scale ({(1 / (selectedLayer as ImageLayer).crop!.width).toFixed(1)}x)</label>
                                <input 
                                    type="range" min="0.1" max="1" step="0.05"
                                    value={(selectedLayer as ImageLayer).crop!.width} // width < 1 means zoom > 1
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value);
                                        onUpdateLayer(selectedLayer.id, { crop: { ...(selectedLayer as ImageLayer).crop!, width: val, height: val } });
                                    }}
                                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] text-gray-500">Pan X</label>
                                <input 
                                    type="range" min="0" max="1" step="0.01"
                                    value={(selectedLayer as ImageLayer).crop!.x}
                                    onChange={(e) => onUpdateLayer(selectedLayer.id, { crop: { ...(selectedLayer as ImageLayer).crop!, x: parseFloat(e.target.value) } })}
                                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                             <div className="flex flex-col gap-1">
                                <label className="text-[10px] text-gray-500">Pan Y</label>
                                <input 
                                    type="range" min="0" max="1" step="0.01"
                                    value={(selectedLayer as ImageLayer).crop!.y}
                                    onChange={(e) => onUpdateLayer(selectedLayer.id, { crop: { ...(selectedLayer as ImageLayer).crop!, y: parseFloat(e.target.value) } })}
                                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        </div>
                     )}
                 </div>
                 
                 <div className="grid grid-cols-2 gap-2">
                     <button 
                         onClick={() => onUpdateLayer(selectedLayer.id, { flipX: !(selectedLayer as ImageLayer).flipX })}
                         className={`p-2 bg-gray-800 rounded hover:bg-gray-700 flex items-center justify-center gap-2 ${(selectedLayer as ImageLayer).flipX ? 'text-brand-400' : 'text-gray-300'}`}
                     >
                         <Icon name="FlipHorizontal" size={16} /> Flip X
                     </button>
                     <button 
                         onClick={() => onUpdateLayer(selectedLayer.id, { flipY: !(selectedLayer as ImageLayer).flipY })}
                         className={`p-2 bg-gray-800 rounded hover:bg-gray-700 flex items-center justify-center gap-2 ${(selectedLayer as ImageLayer).flipY ? 'text-brand-400' : 'text-gray-300'}`}
                     >
                         <Icon name="FlipVertical" size={16} /> Flip Y
                     </button>
                 </div>
                 
                 <div className="space-y-4 border-t border-gray-700 pt-3">
                     <div className="flex justify-between items-center">
                        <h3 className="text-xs font-bold text-gray-400 uppercase">Adjustments</h3>
                        <button 
                          className="text-[10px] text-brand-400 hover:text-brand-300"
                          onClick={() => onUpdateLayer(selectedLayer.id, { filters: { brightness: 100, contrast: 100, saturate: 100, grayscale: 0, blur: 0, sepia: 0 } })}
                        >Reset</button>
                     </div>

                     <div className="grid grid-cols-2 gap-3">
                       {/* Saturation */}
                       <div className="bg-gray-800 p-2 rounded">
                         <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                            <span>Saturation</span>
                            <span>{(selectedLayer as ImageLayer).filters?.saturate}%</span>
                         </div>
                         <input type="range" min="0" max="200" step="10" 
                            value={(selectedLayer as ImageLayer).filters?.saturate}
                            onChange={(e) => onUpdateLayer(selectedLayer.id, { filters: { ...(selectedLayer as ImageLayer).filters, saturate: parseInt(e.target.value) } })}
                            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                         />
                       </div>

                       {/* Brightness */}
                       <div className="bg-gray-800 p-2 rounded">
                         <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                            <span>Brightness</span>
                            <span>{(selectedLayer as ImageLayer).filters?.brightness}%</span>
                         </div>
                         <input type="range" min="0" max="200" step="10" 
                            value={(selectedLayer as ImageLayer).filters?.brightness}
                            onChange={(e) => onUpdateLayer(selectedLayer.id, { filters: { ...(selectedLayer as ImageLayer).filters, brightness: parseInt(e.target.value) } })}
                            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                         />
                       </div>

                       {/* Contrast */}
                       <div className="bg-gray-800 p-2 rounded">
                         <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                            <span>Contrast</span>
                            <span>{(selectedLayer as ImageLayer).filters?.contrast}%</span>
                         </div>
                         <input type="range" min="0" max="200" step="10" 
                            value={(selectedLayer as ImageLayer).filters?.contrast}
                            onChange={(e) => onUpdateLayer(selectedLayer.id, { filters: { ...(selectedLayer as ImageLayer).filters, contrast: parseInt(e.target.value) } })}
                            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                         />
                       </div>

                       {/* Blur */}
                       <div className="bg-gray-800 p-2 rounded">
                         <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                            <span>Blur</span>
                            <span>{(selectedLayer as ImageLayer).filters?.blur}px</span>
                         </div>
                         <input type="range" min="0" max="20" step="1" 
                            value={(selectedLayer as ImageLayer).filters?.blur}
                            onChange={(e) => onUpdateLayer(selectedLayer.id, { filters: { ...(selectedLayer as ImageLayer).filters, blur: parseInt(e.target.value) } })}
                            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                         />
                       </div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-2 mt-2">
                        <button 
                           onClick={() => onUpdateLayer(selectedLayer.id, { filters: { ...(selectedLayer as ImageLayer).filters, grayscale: (selectedLayer as ImageLayer).filters?.grayscale ? 0 : 100 } })}
                           className={`p-2 rounded text-xs border border-gray-600 ${(selectedLayer as ImageLayer).filters?.grayscale ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            B&W
                        </button>
                        <button 
                           onClick={() => onUpdateLayer(selectedLayer.id, { filters: { ...(selectedLayer as ImageLayer).filters, sepia: (selectedLayer as ImageLayer).filters?.sepia ? 0 : 100 } })}
                           className={`p-2 rounded text-xs border border-gray-600 ${(selectedLayer as ImageLayer).filters?.sepia ? 'bg-[#704214] text-white border-[#704214]' : 'text-gray-400 hover:text-white'}`}
                        >
                            Sepia
                        </button>
                     </div>

                 </div>

                 {/* Image Glow */}
                 <div className="space-y-4 border-t border-gray-700 pt-3">
                     <h3 className="text-xs font-bold text-gray-400 uppercase">Image Glow</h3>
                     <div className="bg-gray-800 p-2 rounded space-y-2">
                         <div className="flex justify-between items-center">
                             <span className="text-[10px] text-gray-400">Enable</span>
                             <input 
                                 type="checkbox"
                                 checked={!!selectedLayer.glowSettings?.enabled}
                                 onChange={(e) => onUpdateLayer(selectedLayer.id, { 
                                     glowSettings: { 
                                         ...(selectedLayer.glowSettings || { color: '#0ea5e9', size: 20, intensity: 1 }), 
                                         enabled: e.target.checked 
                                     } 
                                 })}
                             />
                         </div>
                         {selectedLayer.glowSettings?.enabled && (
                             <div className="space-y-2">
                                 <div className="flex gap-2 items-center">
                                     <input 
                                         type="color"
                                         value={selectedLayer.glowSettings.color}
                                         onChange={(e) => onUpdateLayer(selectedLayer.id, { 
                                             glowSettings: { ...selectedLayer.glowSettings!, color: e.target.value } 
                                         })}
                                         className="w-6 h-6 rounded border-none bg-transparent shrink-0"
                                     />
                                     <div className="flex-1 space-y-1">
                                        <div className="flex justify-between text-[8px] text-gray-500">
                                            <span>Size</span>
                                            <span>Intensity</span>
                                        </div>
                                        <div className="flex gap-2">
                                             <input 
                                                 type="range" min="1" max="100" step="1"
                                                 value={selectedLayer.glowSettings.size}
                                                 onChange={(e) => onUpdateLayer(selectedLayer.id, { 
                                                     glowSettings: { ...selectedLayer.glowSettings!, size: parseInt(e.target.value) } 
                                                 })}
                                                 className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                             />
                                             <input 
                                                 type="range" min="0" max="1" step="0.1"
                                                 value={selectedLayer.glowSettings.intensity}
                                                 onChange={(e) => onUpdateLayer(selectedLayer.id, { 
                                                     glowSettings: { ...selectedLayer.glowSettings!, intensity: parseFloat(e.target.value) } 
                                                 })}
                                                 className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                             />
                                        </div>
                                     </div>
                                 </div>
                             </div>
                         )}
                     </div>
                 </div>

                 {/* Image Gradients */}
                 <div className="space-y-2 border-t border-gray-700 pt-3">
                     <div className="flex justify-between items-center">
                        <h3 className="text-xs font-bold text-gray-400 uppercase">Gradient Overlay</h3>
                        <input 
                            type="checkbox" 
                            checked={!!(selectedLayer as ImageLayer).gradientOverlay?.enabled} 
                            onChange={(e) => onUpdateLayer(selectedLayer.id, { 
                                gradientOverlay: { 
                                    ...((selectedLayer as ImageLayer).gradientOverlay || { colors: ['transparent', 'transparent'], direction: 180, opacity: 0.5 }), 
                                    enabled: e.target.checked 
                                } 
                            })}
                        />
                     </div>
                     
                     {(selectedLayer as ImageLayer).gradientOverlay?.enabled && (
                         <div className="space-y-3">
                             <div className="grid grid-cols-4 gap-2">
                                 {IMAGE_GRADIENTS.map((g, i) => (
                                     <button 
                                         key={i}
                                         onClick={() => onUpdateLayer(selectedLayer.id, { 
                                             gradientOverlay: { 
                                                 ...(selectedLayer as ImageLayer).gradientOverlay!, 
                                                 colors: g.colors 
                                             } 
                                         })}
                                         className="w-full h-8 rounded border border-gray-600"
                                         style={{ background: `linear-gradient(135deg, ${g.colors[0]}, ${g.colors[1]})` }}
                                         title={g.name}
                                     />
                                 ))}
                             </div>
                             
                             <div className="space-y-2">
                                 <div className="flex justify-between text-[10px] text-gray-500">
                                     <span>Opacity</span>
                                     <span>{Math.round(((selectedLayer as ImageLayer).gradientOverlay?.opacity || 0) * 100)}%</span>
                                 </div>
                                 <input 
                                     type="range" min="0" max="1" step="0.05"
                                     value={(selectedLayer as ImageLayer).gradientOverlay?.opacity}
                                     onChange={(e) => onUpdateLayer(selectedLayer.id, { 
                                         gradientOverlay: { ...(selectedLayer as ImageLayer).gradientOverlay!, opacity: Number(e.target.value) } 
                                     })}
                                     className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                 />
                                 
                                 <div className="flex justify-between text-[10px] text-gray-500">
                                     <span>Angle</span>
                                     <span>{(selectedLayer as ImageLayer).gradientOverlay?.direction}°</span>
                                 </div>
                                 <input 
                                     type="range" min="0" max="360" step="15"
                                     value={(selectedLayer as ImageLayer).gradientOverlay?.direction}
                                     onChange={(e) => onUpdateLayer(selectedLayer.id, { 
                                         gradientOverlay: { ...(selectedLayer as ImageLayer).gradientOverlay!, direction: Number(e.target.value) } 
                                     })}
                                     className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                 />
                             </div>
                         </div>
                     )}
                 </div>
            </section>
        )}

      </div>
    </div>
  );
};