import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

  const buttonStyle = {
    padding: '6px',
    color: '#9ca3af',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
  };

  const actionButtonStyle = {
    padding: '6px',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    color: '#9ca3af',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  };

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        backgroundColor: '#0B0F19',
        overflow: 'hidden',
        minHeight: '380px',
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
        ...(isFullscreen ? {
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          height: '100vh',
          backgroundColor: 'black'
        } : {})
      }}
    >
      {/* Floating Zoom/Fullscreen Toolbar */}
      <div 
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '6px',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', borderRight: '1px solid rgba(255, 255, 255, 0.1)', paddingRight: '8px', marginRight: '4px' }}>
          <button onClick={handleZoomOut} style={buttonStyle} title="Zoom Out">
            <ZoomOut size={16} />
          </button>
          <span style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 'bold', color: '#d1d5db', width: '36px', textAlign: 'center' }}>
            {Math.round(scale * 100)}%
          </span>
          <button onClick={handleZoomIn} style={buttonStyle} title="Zoom In">
            <ZoomIn size={16} />
          </button>
          <button onClick={handleReset} style={buttonStyle} title="Reset View">
            <Move size={16} />
          </button>
        </div>
        <button onClick={toggleFullscreen} style={buttonStyle} title="Toggle Fullscreen">
          {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
        </button>
      </div>

      {/* Social / Export Stub Toolbar */}
      <div 
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <button 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            color: '#a5b4fc',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          title="Download GIF or Video"
        >
          <Download size={14} /> GIF/Video
        </button>
        <button style={actionButtonStyle} title="Share Visualizer">
          <Share2 size={14} />
        </button>
        <button style={actionButtonStyle} title="Bookmark Lesson">
          <Bookmark size={14} />
        </button>
      </div>

      {/* Interactive Draggable Canvas */}
      <motion.div 
        drag
        dragConstraints={containerRef}
        dragElastic={0.2}
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'grab'
        }}
      >
        <motion.div 
          animate={{ scale }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {children}
        </motion.div>
      </motion.div>
      
      {/* Background Decor */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.05) 0%, transparent 70%)' }} />
    </div>
  );
}
