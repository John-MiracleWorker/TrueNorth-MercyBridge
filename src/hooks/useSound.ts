import { useCallback, useRef, useEffect } from 'react';

let globalAudioContext: AudioContext | null = null;
let contextResumed = false;

const getGlobalAudioContext = (): AudioContext | null => {
    if (!globalAudioContext) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
            globalAudioContext = new AudioContextClass();
        }
    }
    return globalAudioContext;
};

const ensureContextResumed = async () => {
    const ctx = getGlobalAudioContext();
    if (ctx && ctx.state === 'suspended' && !contextResumed) {
        try {
            await ctx.resume();
            contextResumed = true;
        } catch {
            // Fail silently
        }
    }
};

export function useSound() {
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            const resumeOnInteraction = () => {
                void ensureContextResumed();
                document.removeEventListener('touchstart', resumeOnInteraction);
                document.removeEventListener('click', resumeOnInteraction);
            };
            document.addEventListener('touchstart', resumeOnInteraction, { once: true });
            document.addEventListener('click', resumeOnInteraction, { once: true });
        }
    }, []);

    const playTone = useCallback(async (frequency: number, type: OscillatorType, duration: number) => {
        try {
            const ctx = getGlobalAudioContext();
            if (!ctx) return;

            if (ctx.state === 'suspended') {
                await ctx.resume();
                contextResumed = true;
            }

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(frequency, ctx.currentTime);

            // Subtle but audible volume
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch {
            // Fail silently for UI sounds
        }
    }, []);

    const playClick = useCallback(() => {
        void playTone(800, 'sine', 0.08);
    }, [playTone]);

    const playSuccess = useCallback(() => {
        void playTone(880, 'sine', 0.1);
        setTimeout(() => void playTone(1320, 'sine', 0.15), 100);
    }, [playTone]);

    const playError = useCallback(() => {
        void playTone(220, 'triangle', 0.25);
    }, [playTone]);

    const playThud = useCallback(() => {
        void playTone(120, 'sine', 0.12);
    }, [playTone]);

    return {
        playClick,
        playSuccess,
        playError,
        playThud,
        ensureContextResumed,
    };
}
