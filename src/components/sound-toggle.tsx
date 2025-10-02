import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

export const SoundToggle = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Check if user has previously enabled sound
    const soundEnabled =
      localStorage.getItem("portfolio-sound-enabled") === "true";
    setIsMuted(!soundEnabled);

    // Create ambient audio (we'll use a placeholder for now)
    if (!audioRef.current) {
      audioRef.current = new Audio();
      // In a real implementation, you'd load an ambient sound file
      // audioRef.current.src = '/ambient-sound.mp3';
      audioRef.current.loop = true;
      audioRef.current.volume = 0.1; // Very low volume for ambient
    }
  }, []);

  const toggleSound = () => {
    if (isMuted) {
      // Enable sound
      setIsMuted(false);
      setIsPlaying(true);
      localStorage.setItem("portfolio-sound-enabled", "true");

      // In a real implementation, this would start playing ambient sound
      // audioRef.current?.play().catch(() => {
      //   // Handle autoplay restrictions
      // });
    } else {
      // Disable sound
      setIsMuted(true);
      setIsPlaying(false);
      localStorage.setItem("portfolio-sound-enabled", "false");

      // Stop ambient sound
      audioRef.current?.pause();
    }
  };

  return (
    <Button
      onClick={toggleSound}
      className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-background/80 backdrop-blur-md border border-border/20 hover:bg-background hover-scale shadow-lg"
      aria-label={isMuted ? "Enable ambient sound" : "Disable ambient sound"}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-muted-foreground" />
      ) : isPlaying ? (
        <Volume2 className="w-5 h-5 text-accent" />
      ) : (
        <Play className="w-5 h-5 text-accent" />
      )}
    </Button>
  );
};
