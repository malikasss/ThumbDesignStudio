export enum LayerType {
  IMAGE = 'IMAGE',
  TEXT = 'TEXT',
  SHAPE = 'SHAPE' // Future proofing
}

export interface GlowSettings {
  enabled: boolean;
  color: string;
  size: number;
  intensity: number;
}

export interface BaseLayer {
  id: string;
  type: LayerType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  shadow?: string;
  glow?: string; // Legacy string based glow
  glowSettings?: GlowSettings; // New structured glow
  blendMode?: string;
}

export interface ImageGradient {
  enabled: boolean;
  colors: string[]; // ['#color1', '#color2']
  direction: number; // degrees
  opacity: number;
}

export interface ImageFilters {
  brightness: number; // % (default 100)
  contrast: number;   // % (default 100)
  saturate: number;   // % (default 100)
  grayscale: number;  // % (default 0)
  blur: number;       // px (default 0)
  sepia: number;      // % (default 0)
}

export interface ImageLayer extends BaseLayer {
  type: LayerType.IMAGE;
  src: string;
  flipX: boolean;
  flipY: boolean;
  crop?: { x: number; y: number; width: number; height: number }; // Percentage 0-1
  gradientOverlay?: ImageGradient;
  filters: ImageFilters;
}

export type BackdropType = 'solid' | 'soft' | 'glass' | 'rough' | 'neon' | 'carbon' | 'scanline' | 'none';

export interface TextLayer extends BaseLayer {
  type: LayerType.TEXT;
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: string; // normal, italic
  textDecoration: string; // none, underline
  color: string; // hex or gradient css
  textAlign: 'left' | 'center' | 'right';
  letterSpacing: number;
  lineHeight: number;
  strokeColor: string;
  strokeWidth: number;
  // Backdrop settings
  backdropType: BackdropType;
  backgroundColor?: string;
  backgroundPadding: number;
  backgroundRadius: number;
  backgroundOpacity: number;
}

export type Layer = ImageLayer | TextLayer;

export interface CanvasSize {
  width: number;
  height: number;
}

export interface AppState {
  layers: Layer[];
  selectedLayerIds: string[];
  canvasSize: CanvasSize;
  zoom: number;
  showGrid: boolean;
  snapToGrid: boolean;
  history: Layer[][]; // Simple undo stack
  historyIndex: number;
}

export interface GradientPreset {
  name: string;
  value: string;
}

export interface DualColorPreset {
  name: string;
  colors: string[];
}