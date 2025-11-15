import React, { useState, useRef, useContext } from 'react';
import { analyzeWasteImage } from '../services/geminiService';
import { ScanResult, WasteCategory } from '../types';
import Spinner from './common/Spinner';
import Card from './common/Card';
import { WASTE_CATEGORIES } from '../constants';
import { UserContext } from '../App';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error('Failed to read file as base64'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
  
const ResultDisplay: React.FC<{ result: ScanResult; onConfirm: () => void; }> = ({ result, onConfirm }) => {
    const categoryDetails = WASTE_CATEGORIES[result.category] || WASTE_CATEGORIES.unknown;
    const IconComponent = categoryDetails.icon;

    return (
        <Card className="w-full animate-fade-in">
            <h2 className="text-2xl font-bold text-center mb-4">Scan Result</h2>
            <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center p-3 rounded-full bg-${categoryDetails.color}/20`}>
                    <IconComponent className={`w-10 h-10 text-${categoryDetails.color}`} />
                </div>
                <p className="text-xl font-semibold mt-2">{result.objectName}</p>
                <p className={`font-bold text-lg text-${categoryDetails.color}`}>{categoryDetails.label}</p>
            </div>

            <div className="space-y-4 text-left">
                <div className={`p-4 rounded-lg ${result.isContaminated ? 'bg-red-100 dark:bg-red-900/50' : 'bg-green-100 dark:bg-green-900/50'}`}>
                    <h3 className="font-bold text-lg">{result.isContaminated ? 'Contamination Alert!' : 'Clean & Ready!'}</h3>
                    <p className="text-sm">{result.isContaminated ? result.contaminationReason : 'This item appears clean and ready for recycling.'}</p>
                </div>

                <div>
                    <h3 className="font-bold text-lg">Instructions</h3>
                    <p>{result.recyclingInstructions}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                        <p className="text-2xl font-bold text-primary">{result.points}</p>
                        <p className="text-sm text-secondary">Points Earned</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-primary">{result.co2SavedKg.toFixed(2)}</p>
                        <p className="text-sm text-secondary">kg CO₂ Saved</p>
                    </div>
                     <div>
                        <p className="text-2xl font-bold text-primary">{result.waterSavedLiters.toFixed(1)}</p>
                        <p className="text-sm text-secondary">Liters Water Saved</p>
                    </div>
                </div>
            </div>
            <button onClick={onConfirm} className="mt-6 w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-dark transition-colors">
                Awesome! Add to My History
            </button>
        </Card>
    );
};

const Scanner: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userContext = useContext(UserContext);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResult(null);
      setError(null);
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleScan = async () => {
      if (!imageFile) {
          setError("Please select an image first.");
          return;
      }
      setIsLoading(true);
      setError(null);
      setResult(null);
      try {
        const base64Image = await fileToBase64(imageFile);
        const scanResult = await analyzeWasteImage(base64Image, imageFile.type);
        setResult(scanResult);
      } catch (err: any) {
        setError(err.message || "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
  };

  const handleConfirm = () => {
    if (result && userContext?.addHistory) {
      userContext.addHistory({
        id: new Date().toISOString(),
        objectName: result.objectName,
        category: result.category,
        points: result.points,
        timestamp: new Date().toISOString(),
      });
      // Reset state for next scan
      setResult(null);
      setSelectedImage(null);
      setImageFile(null);
    }
  };
  
  const resetScanner = () => {
      setSelectedImage(null);
      setImageFile(null);
      setError(null);
      setResult(null);
      if (fileInputRef.current) {
          fileInputRef.current.value = "";
      }
  };

  return (
    <div className="flex flex-col items-center p-4 h-full">
      {!selectedImage && !isLoading && !result && (
        <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Scan Your Waste</h1>
            <p className="text-secondary dark:text-gray-300 mb-6">Upload a photo to identify and sort your recyclables.</p>
        </div>
      )}

      <div className="w-full max-w-md">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-10">
            <Spinner text="Analyzing..." />
          </div>
        ) : result ? (
          <ResultDisplay result={result} onConfirm={handleConfirm} />
        ) : (
            <>
            <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-secondary dark:text-gray-400 overflow-hidden">
                {selectedImage ? (
                <img src={selectedImage} alt="Selected" className="w-full h-full object-cover" />
                ) : (
                <div className="text-center">
                    <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <p>Image preview will appear here</p>
                </div>
                )}
            </div>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
            />
             {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                 <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-100 font-bold py-3 px-4 rounded-lg hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
                    >
                    {selectedImage ? 'Change Image' : 'Upload Image'}
                </button>
                 <button
                    onClick={handleScan}
                    disabled={!selectedImage || isLoading}
                    className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Scan Item
                </button>
            </div>
            {selectedImage && <button onClick={resetScanner} className="w-full text-center text-sm text-secondary dark:text-gray-400 mt-3 hover:underline">Start Over</button>}
            </>
        )}
      </div>
    </div>
  );
};

export default Scanner;