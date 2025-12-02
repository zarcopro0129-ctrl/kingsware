
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Loader2, Image as ImageIcon, Lock } from 'lucide-react';
import { generateHighQualityImage } from '../services/geminiService';
import { ImageSize } from '../types';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<ImageSize>('1K');
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    if (window.aistudio) {
      window.aistudio.hasSelectedApiKey().then(setHasKey);
    } else {
        setHasKey(!!process.env.API_KEY);
    }
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    try {
      const result = await generateHighQualityImage(prompt, size);
      setImage(result);
    } catch (error) {
      console.error(error);
      alert("Failed to generate image.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col md:flex-row gap-8">
        {/* Controls */}
        <div className="flex-1 flex flex-col justify-between space-y-6">
            <div>
                <div className="flex items-center gap-2 mb-4 text-neutral-400">
                    <Wand2 className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">專屬訂製預覽</span>
                </div>
                <h3 className="text-2xl font-light text-white mb-2">預覽您的空間</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                    透過 Gemini 3 Pro，將 Fisher & Paykel 與 De Dietrich 頂級家電融入您的夢想廚房設計中。
                </p>
            </div>

            {!hasKey ? (
               <div className="p-5 bg-neutral-900/50 rounded-xl border border-neutral-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Lock className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">專業版權限</span>
                  </div>
                  <button 
                    onClick={handleSelectKey}
                    className="w-full py-2 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-neutral-200 transition-colors"
                  >
                    連結帳戶
                  </button>
               </div> 
            ) : (
                <div className="space-y-4">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="描述您的夢想廚房風格 (英文)..."
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white/40 transition-all"
                    />

                    <div className="flex gap-2">
                        {(['1K', '2K', '4K'] as ImageSize[]).map((s) => (
                            <button
                                key={s}
                                onClick={() => setSize(s)}
                                className={`flex-1 py-2 rounded-md text-xs font-medium transition-all border ${
                                    size === s 
                                    ? 'bg-white border-white text-black' 
                                    : 'bg-transparent border-neutral-800 text-neutral-500 hover:border-neutral-600'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !prompt}
                        className={`w-full py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 uppercase tracking-wide ${
                            isLoading || !prompt 
                            ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' 
                            : 'bg-white text-black hover:bg-neutral-200'
                        }`}
                    >
                        {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "開始生成"}
                    </button>
                </div>
            )}
        </div>

        {/* Preview */}
        <div className="flex-1 min-h-[300px] bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 relative group">
            {image ? (
                <motion.img 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={image} 
                    alt="Generated" 
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-700 space-y-2">
                    <ImageIcon className="w-8 h-8 opacity-20" />
                    <span className="text-[10px] uppercase tracking-widest opacity-40">渲染預覽</span>
                </div>
            )}
        </div>
    </div>
  );
};

export default ImageGenerator;
