export type WasteCategory = 'plastic' | 'paper' | 'glass' | 'metal' | 'organic' | 'cardboard' | 'e-waste' | 'hazardous' | 'unknown';

// Result from AI analysis, before user input
export interface AIScanResult {
  objectName: string;
  category: WasteCategory;
  isContaminated: boolean;
  contaminationReason: string;
  recyclingInstructions: string;
  points: number;
}

// Full result after user provides weight and savings are calculated
export interface ScanResult extends AIScanResult {
  co2SavedKg: number;
  waterSavedLiters: number;
  weightKg: number;
}


export interface HistoryItem {
  id: string;
  objectName: string;
  category: WasteCategory;
  points: number;
  timestamp: string;
  weightKg: number;
}

export interface User {
  name: string;
  email: string;
  password?: string;
  points: number;
  level: number;
  history: HistoryItem[];
}
