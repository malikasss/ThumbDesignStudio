import { GradientPreset, DualColorPreset, BackdropType } from "./types";

export const FONTS = [
  { name: 'Anton', value: '"Anton", sans-serif' }, // High impact, bold
  { name: 'Bebas Neue', value: '"Bebas Neue", sans-serif' }, // Tall, standard for thumbnails
  { name: 'Bangers', value: '"Bangers", system-ui' }, // Comic book style
  { name: 'Permanent Marker', value: '"Permanent Marker", cursive' }, // Handwritten
  { name: 'Righteous', value: '"Righteous", cursive' }, // Modern/Sci-fi
  { name: 'Lobster', value: '"Lobster", cursive' }, // Fancy
  { name: 'Inter', value: 'Inter, sans-serif' }, // Clean
  { name: 'Montserrat', value: 'Montserrat, sans-serif' },
];

export const TEXT_GRADIENTS: GradientPreset[] = [
  { name: 'Sunset', value: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)' },
  { name: 'Ocean', value: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)' },
  { name: 'Gold', value: 'linear-gradient(to right, #bf953f, #fcf6ba, #bf953f)' },
  { name: 'Neon', value: 'linear-gradient(to right, #ff00cc, #333399)' },
  { name: 'Fire', value: 'linear-gradient(to right, #f12711, #f5af19)' },
  { name: 'Silver', value: 'linear-gradient(to top, #d5d4d0 0%, #d5d4d0 1%, #eeeeec 31%, #efeeec 75%, #e7e9bb 100%)' },
  { name: 'Lime', value: 'linear-gradient(to right, #11998e, #38ef7d)' },
  { name: 'Holo', value: 'linear-gradient(to right, #667eea, #764ba2)' },
];

// 8 Crucial Colors for Image Overlay
export const IMAGE_GRADIENTS: DualColorPreset[] = [
  { name: 'Vignette', colors: ['transparent', 'rgba(0,0,0,0.8)'] }, // Darken edges
  { name: 'Warmth', colors: ['rgba(255,165,0,0.2)', 'rgba(255,69,0,0.5)'] }, // Orange/Red
  { name: 'Cool', colors: ['rgba(0,255,255,0.2)', 'rgba(0,0,255,0.5)'] }, // Blue/Cyan
  { name: 'Vibe', colors: ['rgba(255,0,255,0.2)', 'rgba(128,0,128,0.5)'] }, // Purple/Pink
  { name: 'Success', colors: ['rgba(144,238,144,0.2)', 'rgba(0,128,0,0.5)'] }, // Green
  { name: 'Alert', colors: ['rgba(255,255,0,0.2)', 'rgba(255,140,0,0.5)'] }, // Yellow/Orange
  { name: 'Midnight', colors: ['rgba(25,25,112,0.3)', 'rgba(0,0,0,0.8)'] }, // Dark Blue
  { name: 'Fade', colors: ['rgba(255,255,255,0)', 'rgba(255,255,255,0.8)'] }, // White Fade
];

export interface BackdropPreset {
  name: string;
  type: BackdropType;
  color: string;
  opacity: number;
  padding: number;
  radius: number;
}

export const BACKDROP_PRESETS: BackdropPreset[] = [
    { name: 'Solid Black', type: 'solid', color: '#000000', opacity: 1, padding: 10, radius: 4 },
    { name: 'Carbon', type: 'carbon', color: '#131313', opacity: 1, padding: 15, radius: 4 },
    { name: 'Cyber', type: 'scanline', color: '#000000', opacity: 0.9, padding: 10, radius: 0 },
    { name: 'Soft Brush', type: 'soft', color: '#000000', opacity: 0.8, padding: 15, radius: 20 },
    { name: 'Glass', type: 'glass', color: '#ffffff', opacity: 0.15, padding: 15, radius: 10 },
    { name: 'Neon Box', type: 'neon', color: '#0ea5e9', opacity: 0.1, padding: 12, radius: 0 },
    { name: 'Rough Paper', type: 'rough', color: '#f5f5f5', opacity: 1, padding: 12, radius: 2 },
    { name: 'Highlight', type: 'solid', color: '#facc15', opacity: 0.9, padding: 5, radius: 0 },
];

export const DEFAULT_CANVAS_SIZE = { width: 1920, height: 1080 };