export type WasteCategory = 'plastic' | 'paper' | 'glass' | 'metal' | 'organic' | 'cardboard' | 'e-waste' | 'hazardous' | 'unknown';

export interface ScanResult {
  objectName: string;
  category: WasteCategory;
  isContaminated: boolean;
  contaminationReason: string;
  recyclingInstructions: string;
  co2SavedKg: number;
  waterSavedLiters: number;
  points: number;
}

export interface HistoryItem {
  id: string;
  objectName: string;
  category: WasteCategory;
  points: number;
  timestamp: string;
}

export interface User {
  name: string;
  email: string;
  password?: string;
  points: number;
  level: number;
  history: HistoryItem[];
}
