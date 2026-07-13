import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import './AnimationControls.css';

/**
 * Reusable Animation Controls Component
 * Provides a UI panel to control the execution timeline of any algorithm.
 */
export function AnimationControls({ engine }) {
  const { 
    currentStep, 
    totalSteps, 
    isPlaying, 
    playbackSpeed, 
    activeSnapshot,
    controls 
  } = engine;

  if (totalSteps === 0) return null;

  const handleSliderChange = (e) => {
    controls.jumpToStep(Number(e.target.value));
  };

  const handleSpeedChange = (e) => {
    controls.setPlaybackSpeed(Number(e.target.value));
  };

  return (
    <div className="engine-controls-container">
      {/* Status Bar */}
      <div className="engine-status">
        <span className="event-badge">{activeSnapshot?.event}</span>
        <span className="event-message">{activeSnapshot?.message}</span>
      </div>

      <div className="engine-panel glass-effect">
        {/* Playback Buttons */}
        <div className="control-group buttons">
          <button onClick={controls.reset} title="Restart" className="icon-btn">
            <RotateCcw size={18} />
          </button>
          <button onClick={controls.prevStep} disabled={currentStep === 0} title="Previous Step" className="icon-btn">
            <SkipBack size={18} />
          </button>
          <button onClick={isPlaying ? controls.pause : controls.play} className="icon-btn primary-btn">
            {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
          </button>
          <button onClick={controls.nextStep} disabled={currentStep >= totalSteps - 1} title="Next Step" className="icon-btn">
            <SkipForward size={18} />
          </button>
        </div>

        {/* Timeline Slider */}
        <div className="control-group timeline">
          <input 
            type="range" 
            min="0" 
            max={Math.max(0, totalSteps - 1)} 
            value={currentStep} 
            onChange={handleSliderChange}
            className="timeline-slider"
          />
          <div className="step-indicator">
            {currentStep + 1} / {totalSteps}
          </div>
        </div>

        {/* Speed Controller */}
        <div className="control-group speed">
          <select value={playbackSpeed} onChange={handleSpeedChange} className="speed-dropdown">
            <option value={1500}>0.25x</option>
            <option value={1000}>0.5x</option>
            <option value={500}>1x</option>
            <option value={250}>2x</option>
            <option value={100}>4x</option>
            <option value={10}>Max</option>
          </select>
        </div>
      </div>
    </div>
  );
}
