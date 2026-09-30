'use client';

import React, { useRef, useState, useEffect } from 'react';
import { CourseReel } from '@/types/discovery';
import { Play, Pause, RotateCcw, CheckCircle2, Clock, Zap } from 'lucide-react';

interface ReelPlayerProps {
  reel: CourseReel;
  onVideoCompleted: () => void;
  isVideoCompleted: boolean;
}

export const ReelPlayer: React.FC<ReelPlayerProps> = ({
  reel,
  onVideoCompleted,
  isVideoCompleted,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [maxTimeWatched, setMaxTimeWatched] = useState(0);

  // Reset video player when reel changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setMaxTimeWatched(0);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  }, [reel.id]);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 0;

    setCurrentTime(curr);
    if (dur > 0) setDuration(dur);

    // Track max progress watched to prevent seek skipping
    if (curr > maxTimeWatched) {
      setMaxTimeWatched(curr);
    }

    // Check for video completion
    if (dur > 0 && curr >= dur - 0.5 && !isVideoCompleted) {
      onVideoCompleted();
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (!isVideoCompleted) {
      onVideoCompleted();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const targetTime = parseFloat(e.target.value);

    // Anti-skip rule: Allow seeking backwards or up to max time watched + 3s buffer
    if (targetTime <= maxTimeWatched + 3 || isVideoCompleted) {
      videoRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    } else {
      // Restrict seeking past unwatched content
      videoRef.current.currentTime = maxTimeWatched;
      setCurrentTime(maxTimeWatched);
    }
  };

  const handleFastCompleteDemo = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration || 10;
      videoRef.current.currentTime = Math.max(0, dur - 0.2);
      setCurrentTime(dur);
      setMaxTimeWatched(dur);
    }
    onVideoCompleted();
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl space-y-0 relative group">
      {/* Top Reel Info Bar */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30 px-2 py-0.5 rounded-full">
              Interactive Reel
            </span>
            {isVideoCompleted && (
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Completed</span>
              </span>
            )}
          </div>
          <h2 className="text-base font-extrabold text-white mt-1">{reel.title}</h2>
        </div>

        {/* Demo Shortcut Button for Instant Evaluation */}
        <button
          onClick={handleFastCompleteDemo}
          title="Instantly mark video complete to test question unlock"
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-[11px] font-bold border border-slate-700 flex items-center space-x-1.5 transition-all"
        >
          <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="hidden sm:inline">Finish Reel (Demo)</span>
        </button>
      </div>

      {/* HTML5 Video Canvas Container */}
      <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          src={reel.videoUrl.includes('#') ? reel.videoUrl : `${reel.videoUrl}#t=0.001`}
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onError={e => {
            // Fallback to demo video if local file is not found yet
            const target = e.currentTarget;
            if (!target.dataset.fallbackTried) {
              target.dataset.fallbackTried = 'true';
              target.src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
              target.load();
            }
          }}
          onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
          playsInline
          className="w-full h-full object-contain"
        />

        {/* Center Overlay Play/Pause Button */}
        <button
          onClick={togglePlay}
          className={`absolute w-16 h-16 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all shadow-2xl ${
            isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100 scale-105'
          }`}
        >
          {isPlaying ? (
            <Pause className="w-7 h-7 fill-current" />
          ) : (
            <Play className="w-7 h-7 fill-current ml-1" />
          )}
        </button>

        {/* Video Completed Overlay Banner */}
        {isVideoCompleted && !isPlaying && (
          <div className="absolute top-4 right-4 bg-emerald-600/90 text-white text-xs font-extrabold px-3 py-1.5 rounded-xl backdrop-blur-md border border-emerald-400/40 shadow-lg flex items-center space-x-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Reel Watched Completely</span>
          </div>
        )}
      </div>

      {/* Bottom Video Controls Bar */}
      <div className="p-4 bg-slate-900 border-t border-slate-800/80 space-y-2 text-slate-300">
        {/* Progress Slider Bar */}
        <div className="flex items-center space-x-3">
          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 accent-brand-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center space-x-3">
            <button
              onClick={togglePlay}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <span className="font-semibold text-slate-200">
              {formatTime(currentTime)} / {formatTime(duration || 105)}
            </span>
          </div>

          <span className="text-[11px] text-slate-400 font-sans">
            {isVideoCompleted ? '✅ Watch finished' : '🔒 Progress tracked'}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 pt-2 border-t border-slate-800/60 font-sans leading-relaxed">
          {reel.description}
        </p>
      </div>
    </div>
  );
};
