// FIX: Replaced JSX with React.createElement to resolve JSX parsing errors in this .ts file.
import React from 'react';
import { WasteCategory } from './types';

interface CategoryDetails {
  label: string;
  color: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
}

const PlasticIcon = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20 12l-2.5-4.5-2.5 4.5h5zm-15 0l2.5-4.5L5 12H0m12.5-4.5L10 3 7.5 7.5m9 9L19 21l-2.5-4.5m-9 0L5 21l2.5-4.5M10 12h4" })
  )
);
const PaperIcon = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" })
  )
);
const GlassIcon = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M14.25 2.25L12 4.5l-2.25-2.25m4.5 0V7.5a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75V2.25m4.5 0h.008v.008h-.008V2.25zm-7.5 0h.008v.008h-.008V2.25zM12 21.75l2.25-2.25-2.25-2.25-2.25 2.25L12 21.75z" })
  )
);
const MetalIcon = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M16.5 6.375l-6-3-6 3v11.25l6 3 6-3V6.375zM12 18.75L6 15.75m6 3l6-3m-6-10.5L6 9.75m6-3l6 3" })
  )
);
const OrganicIcon = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" })
  )
);
const CardboardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" })
  )
);
const EWasteIcon = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6V4m0 16v-2m8-8h2M4 12H2m15.364 6.364l1.414 1.414M4.222 4.222l1.414 1.414m12.728 0l-1.414 1.414M5.636 18.364l-1.414 1.414M12 18a6 6 0 100-12 6 6 0 000 12z" })
  )
);
const HazardousIcon = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" })
  )
);
const UnknownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })
  )
);


export const WASTE_CATEGORIES: Record<WasteCategory, CategoryDetails> = {
  plastic: { label: 'Plastic', color: 'blue-500', icon: PlasticIcon },
  paper: { label: 'Paper', color: 'yellow-500', icon: PaperIcon },
  glass: { label: 'Glass', color: 'green-500', icon: GlassIcon },
  metal: { label: 'Metal', color: 'gray-500', icon: MetalIcon },
  organic: { label: 'Organic', color: 'orange-500', icon: OrganicIcon },
  cardboard: { label: 'Cardboard', color: 'amber-700', icon: CardboardIcon },
  'e-waste': { label: 'E-Waste', color: 'indigo-500', icon: EWasteIcon },
  hazardous: { label: 'Hazardous', color: 'red-500', icon: HazardousIcon },
  unknown: { label: 'Unknown', color: 'slate-400', icon: UnknownIcon },
};

export const SAVINGS_FACTORS: Record<WasteCategory, { co2PerKg: number, waterPerKg: number }> = {
  plastic: { co2PerKg: 1.5, waterPerKg: 25 },
  paper: { co2PerKg: 0.9, waterPerKg: 18 },
  glass: { co2PerKg: 0.3, waterPerKg: 5 },
  metal: { co2PerKg: 5.0, waterPerKg: 40 },
  organic: { co2PerKg: 0.1, waterPerKg: 2 },
  cardboard: { co2PerKg: 0.8, waterPerKg: 15 },
  'e-waste': { co2PerKg: 10.0, waterPerKg: 100 },
  hazardous: { co2PerKg: 0, waterPerKg: 0 },
  unknown: { co2PerKg: 0, waterPerKg: 0 },
};
