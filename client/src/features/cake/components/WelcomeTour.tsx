import { X, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../../../shared/components/ui/button';

const TOUR_KEY = 'forestgift_cake_dashboard_tour_seen';

export function WelcomeTour() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem(TOUR_KEY);
    if (!hasSeenTour) {
      const t = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(t);
    }
  }, []);

  const steps = [
    {
      title: 'Welcome to ForestGift Partner Dashboard! 🎉',
      description:
        "We're excited to have you on board. This dashboard helps you manage deliveries while contributing to a greener planet.",
    },
    {
      title: 'Accept Delivery Requests 📦',
      description:
        'Review new delivery requests, view cake details, and accept orders that fit your schedule.',
    },
    {
      title: 'Birthday alerts 🎂',
      description:
        'The dashboard highlights the nearest customer birthdays so you can time deliveries or a personal touch.',
    },
    {
      title: 'Plant Trees, Earn Rewards 🌳',
      description:
        'Every delivery plants trees through ForestGift — your shop helps customers celebrate while supporting reforestation.',
    },
  ];

  const handleComplete = () => {
    localStorage.setItem(TOUR_KEY, 'true');
    setIsVisible(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isVisible) return null;

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="bg-gradient-to-r from-[#EC4899] to-[#FBCFE8] px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Getting Started</h3>
            <button
              type="button"
              onClick={handleSkip}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h4 className="text-2xl font-bold text-[#1F2937] mb-3">{step.title}</h4>
            <p className="text-gray-600 leading-relaxed">{step.description}</p>
          </div>

          <div className="flex gap-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-gradient-to-r from-[#EC4899] to-[#FBCFE8]'
                    : index < currentStep
                      ? 'bg-[#EC4899]'
                      : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={handleSkip} className="text-gray-600 hover:text-[#EC4899]">
              Skip Tour
            </Button>
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-[#EC4899] to-[#FBCFE8] hover:opacity-90 text-white shadow-md hover:shadow-lg transition-all"
            >
              {currentStep < steps.length - 1 ? (
                <>
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                "Let's Go! 🚀"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
