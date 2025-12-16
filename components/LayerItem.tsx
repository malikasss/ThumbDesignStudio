import React from 'react';
import { Layer, LayerType, TextLayer } from '../types';
import { Icon } from './Icon';

interface LayerItemProps {
    layer: Layer;
    isSelected: boolean;
    onSelect: () => void;
    onToggleVisibility: () => void;
    onToggleLock: () => void;
}

export const LayerItem: React.FC<LayerItemProps> = ({ layer, isSelected, onSelect, onToggleVisibility, onToggleLock }) => {
    return (
        <div 
            onClick={onSelect}
            className={`flex items-center gap-2 p-2 rounded cursor-pointer text-sm select-none border border-transparent ${isSelected ? 'bg-brand-900/30 border-brand-500/50' : 'hover:bg-gray-800'}`}
        >
            <div className="text-gray-400">
                {layer.type === LayerType.TEXT ? <Icon name="Type" size={14} /> : <Icon name="Image" size={14} />}
            </div>
            <span className="flex-1 truncate text-gray-200">
                {layer.name || (layer.type === LayerType.TEXT ? (layer as TextLayer).text : 'Image')}
            </span>
            <button 
                onClick={(e) => { e.stopPropagation(); onToggleLock(); }}
                className={`p-1 hover:text-white ${layer.locked ? 'text-red-400' : 'text-gray-600'}`}
            >
                <Icon name={layer.locked ? "Lock" : "Unlock"} size={12} />
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }}
                className={`p-1 hover:text-white ${!layer.visible ? 'text-gray-600' : 'text-gray-400'}`}
            >
                <Icon name={layer.visible ? "Eye" : "EyeOff"} size={12} />
            </button>
        </div>
    );
};
