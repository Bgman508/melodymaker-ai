import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { X, ArrowRight, ArrowLeft } from "lucide-react";

const TOUR_STEPS = [
  {
    target: '[data-prompt]',
    title: 'Write Your Prompt',
    description: 'Describe your composition in plain English. Try "trap soul, 140 bpm, F# minor, hook with 808 slides"',
    position: 'right'
  },
  {
    target: '.btn-compose',
    title: 'Hit Compose',
    description: 'Press ⌘+Enter or click to generate your MIDI composition in seconds',
    position: 'right'
  },
  {
    target: '[data-piano-roll]',
    title: 'Visual Piano Roll',
    description: 'See your composition come to life. Each color represents a different track',
    position: 'bottom'
  }
];

export default function OnboardingTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setTimeout(() => setShow(true), 1000);
    }
  }, []);

  useEffect(() => {
    if (show && TOUR_STEPS[currentStep]) {
      const target = document.querySelector(TOUR_STEPS[currentStep].target);
      if (target) {
        const rect = target.getBoundingClientRect();
        const pos = TOUR_STEPS[currentStep].position;
        
        if (pos === 'right') {
          setPosition({ top: rect.top, left: rect.right + 20 });
        } else if (pos === 'bottom') {
          setPosition({ top: rect.bottom + 20, left: rect.left });
        }
        
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [show, currentStep]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setShow(false);
    localStorage.setItem('hasSeenTour', 'true');
  };

  if (!show) return null;

  const step = TOUR_STEPS[currentStep];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
        onClick={handleClose}
      />

      {/* Tour Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            zIndex: 101
          }}
          className="bg-[var(--surface)] border-2 border-[var(--mint)] rounded-2xl p-6 shadow-2xl max-w-sm"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg text-[var(--text)]">{step.title}</h3>
              <p className="text-sm text-[var(--muted)] mt-1">
                Step {currentStep + 1} of {TOUR_STEPS.length}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-[var(--muted)] hover:text-[var(--text)]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-[var(--text)] mb-6">{step.description}</p>

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handlePrev}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-1">
              {TOUR_STEPS.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === currentStep ? 'bg-[var(--mint)]' : 'bg-[var(--muted)]'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              className="bg-[var(--mint)] text-black hover:bg-[var(--mint-hover)]"
            >
              {currentStep === TOUR_STEPS.length - 1 ? 'Get Started' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}