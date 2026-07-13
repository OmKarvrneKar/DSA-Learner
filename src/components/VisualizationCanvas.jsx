import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize, Minimize, Move, Download, Share2, Bookmark } from 'lucide-react';

/**
 * A highly interactive, reusable wrapper for algorithm visualizations.
 * Provides Pan, Zoom, Fullscreen, and Export UI out of the box.
 */
export function VisualizationCanvas({ children }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.4));
  const handleReset = () => setScale(1);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative flex flex-col flex-1 w-full bg-[#0B0F19] overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50 h-screen bg-black' : 'rounded-t-xl min-h-[350px]'
      }`}
    >
      {/* Floating Toolbar */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 p-1.5 rounded-xl shadow-2xl">
        <div className="flex items-center gap-1 border-r border-white/10 pr-2 mr-1">
          <button onClick={handleZoomOut} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Zoom Out">
            <ZoomOut size={16} />
          </button>
          <span className="text-xs font-mono font-bold text-gray-300 w-9 text-center">{Math.round(scale * 100)}%</span>
          <button onClick={handleZoomIn} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Zoom In">
            <ZoomIn size={16} />
          </button>
          <button onClick={handleReset} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Reset View">
            <Move size={16} />
          </button>
        </div>
        <button onClick={toggleFullscreen} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Toggle Fullscreen">
          {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
        </button>
      </div>

      {/* Social / Export Stub Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30 rounded-lg text-xs font-bold transition-colors shadow-lg">
          <Download size={14} /> GIF/Video
        </button>
        <button className="p-1.5 bg-black/40 text-gray-400 hover:text-white border border-white/10 rounded-lg transition-colors shadow-lg">
          <Share2 size={14} />
        </button>
        <button className="p-1.5 bg-black/40 text-gray-400 hover:text-amber-400 border border-white/10 rounded-lg transition-colors shadow-lg">
          <Bookmark size={14} />
        </button>
      </div>

      {/* Interactive Draggable Canvas */}
      <motion.div 
        drag
        dragConstraints={containerRef}
        dragElastic={0.2}
        className="flex-1 w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        <motion.div 
          animate={{ scale }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative flex items-center justify-center"
        >
          {children}
        </motion.div>
      </motion.div>
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)]" />
    </div>
  );
}
