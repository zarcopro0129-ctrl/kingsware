
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
}

export type ImageSize = '1K' | '2K' | '4K';

export interface ImageGenerationState {
  isLoading: boolean;
  image: string | null;
  error: string | null;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    webkitAudioContext: typeof AudioContext;
    aistudio?: AIStudio;
  }
}
