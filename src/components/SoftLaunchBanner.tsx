import { useState, useEffect } from 'react';
import { Rocket, AlertCircle } from 'lucide-react';
import { useAppStatus } from '@/hooks/useAppStatus';

export const SoftLaunchBanner = () => {
  const { status, isLoading } = useAppStatus('localz');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);

  // Track hero section visibility
  useEffect(() => {
    const heroSection = document.querySelector('section');
    if (!heroSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsHeroVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    observer.observe(heroSection);
    return () => observer.disconnect();
  }, []);

  // Hide banner if loading, app is live, or hero not visible
  if (isLoading || status?.status === 'live' || !isHeroVisible) return null;

  const scrollToFooter = () => {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Desktop Version - Right-side vertical badge */}
      <div 
        className="hidden md:block fixed right-4 top-1/2 -translate-y-1/2 z-50"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        role="complementary"
        aria-label="Soft launch announcement"
      >
        {!isExpanded ? (
          // Compact vertical badge
          <div className="bg-black/30 backdrop-blur-md border-2 border-brand-pink text-white p-2 rounded-full shadow-lg cursor-pointer hover:shadow-xl hover:bg-black/40 transition-all duration-300">
            <div className="flex flex-col items-center gap-1 h-20">
              <Rocket className="w-5 h-5" />
              <span className="text-xs font-bold [writing-mode:vertical-rl] rotate-180">
                Soft Launch
              </span>
            </div>
          </div>
        ) : (
          // Expanded card
          <div className="bg-black/40 backdrop-blur-md border-2 border-brand-pink rounded-lg shadow-2xl p-4 w-96 animate-in slide-in-from-right duration-300">
            <div className="flex items-start gap-3">
              <div className="bg-brand-pink/20 border border-brand-pink p-2 rounded-full flex-shrink-0">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-bold text-white">
                  🚀 Soft Launch in {status?.launchLocation || 'Bristol'}
                </h3>
                <p className="text-sm text-white/90 leading-relaxed">
                  We're just getting started here. Sign up and add your details, and we'll send you 
                  matches via in-app Alerts even while things are filling up.
                  {status?.isFreeInLaunchLocation && (
                    <span className="font-semibold text-brand-pink">
                      {' '}It's free in {status.launchLocation}
                    </span>
                  )}; we'll only start charging when we roll out across the UK.
                </p>
                <button 
                  onClick={scrollToFooter}
                  className="text-sm text-brand-pink hover:text-white underline transition-colors inline-flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  Want to help even more? Tap to scroll to Contribute
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Version - Bottom-right badge */}
      <div 
        className="md:hidden fixed bottom-20 right-4 z-50"
        role="complementary"
        aria-label="Soft launch announcement"
      >
        {!isExpanded ? (
          // Compact horizontal badge
          <button
            onClick={() => setIsExpanded(true)}
            aria-expanded={isExpanded}
            className="bg-black/30 backdrop-blur-md border-2 border-brand-pink text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:shadow-xl hover:bg-black/40 transition-all duration-300"
          >
            <Rocket className="w-4 h-4" />
            <span className="text-sm font-bold">Soft Launch</span>
          </button>
        ) : (
          // Expanded card
          <div className="relative bg-black/40 backdrop-blur-md border-2 border-brand-pink rounded-lg shadow-2xl p-4 w-[85vw] animate-in slide-in-from-bottom duration-300">
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-2 right-2 text-white/60 hover:text-white transition-colors z-10"
              aria-label="Close"
            >
              ✕
            </button>
            <div className="flex items-start gap-3">
              <div className="bg-brand-pink/20 border border-brand-pink p-2 rounded-full flex-shrink-0">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 space-y-2 pr-6">
                <h3 className="text-base font-bold text-white">
                  🚀 Soft Launch in {status?.launchLocation || 'Bristol'}
                </h3>
                <p className="text-sm text-white/90 leading-relaxed">
                  We're just getting started. Sign up and we'll send you matches via Alerts.
                  {status?.isFreeInLaunchLocation && (
                    <span className="font-semibold text-brand-pink">
                      {' '}Free in {status.launchLocation}!
                    </span>
                  )}
                </p>
                <button 
                  onClick={scrollToFooter}
                  className="text-sm text-brand-pink hover:text-white underline transition-colors inline-flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  Contribute
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
