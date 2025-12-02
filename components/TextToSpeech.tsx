
import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, Volume2, Activity } from 'lucide-react';
import { generateSpeech } from '../services/geminiService';
import { decodeAudioData } from '../utils/audioUtils';

const TextToSpeech: React.FC = () => {
  const [text, setText] = useState("體驗 Kingsware 生活的藝術。");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const handlePlay = async () => {
    if (!text) return;
    if (isPlaying && sourceNodeRef.current) {
        sourceNodeRef.current.stop();
        setIsPlaying(false);
        return;
    }

    setIsGenerating(true);
    try {
      const audioBufferData = await generateSpeech(text);
      
      if (!audioContextRef.current) return;
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const uint8View = new Uint8Array(audioBufferData);
      const audioBuffer = await decodeAudioData(uint8View, audioContextRef.current, 24000, 1);

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      
      source.onended = () => setIsPlaying(false);
      sourceNodeRef.current = source;
      source.start();
      setIsPlaying(true);

    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col justify-between">
         <div className="flex items-center justify-between mb-4 text-neutral-400">
            <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">語音體驗</span>
            </div>
            {isPlaying && <Activity className="w-4 h-4 text-white animate-pulse" />}
        </div>

        <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-transparent text-xl font-light text-white border-none focus:ring-0 resize-none placeholder-neutral-700 leading-normal"
            rows={3}
            placeholder="輸入文字以播放..."
        />

        <div className="mt-4 flex items-center justify-between pt-4 border-t border-neutral-800">
            <span className="text-[10px] uppercase text-neutral-600 tracking-widest">Gemini 2.5 Flash</span>
            <button 
                onClick={handlePlay}
                disabled={isGenerating}
                className={`
                    h-10 w-10 rounded-full flex items-center justify-center transition-all
                    ${isPlaying ? 'bg-white text-black' : 'bg-neutral-800 text-white hover:bg-neutral-700'}
                `}
            >
                {isGenerating ? (
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isPlaying ? (
                    <Square className="w-3 h-3 fill-current" />
                ) : (
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                )}
            </button>
        </div>
    </div>
  );
};

export default TextToSpeech;
