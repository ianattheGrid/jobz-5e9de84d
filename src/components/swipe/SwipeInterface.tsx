import React, { useState } from 'react';
import { SwipeCard } from './SwipeCard';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, X, RotateCcw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface SwipeInterfaceProps {
  data: any[];
  type: 'candidate' | 'employer';
  onMatch: (item: any) => void;
  onPass: (item: any) => void;
  onPending?: (item: any) => void;
}

export const SwipeInterface: React.FC<SwipeInterfaceProps> = ({ 
  data, 
  type, 
  onMatch, 
  onPass,
  onPending 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<any[]>([]);
  const [pending, setPending] = useState<any[]>([]);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [lastMatch, setLastMatch] = useState<any>(null);
  const { toast } = useToast();

  const handleSwipe = (action: 'accept' | 'reject' | 'pending') => {
    const currentItem = data[currentIndex];
    const actionMessages = {
      accept: `✨ You liked ${currentItem?.name}!`,
      reject: `👋 Passed on ${currentItem?.name}`,
      pending: `⏳ ${currentItem?.name} saved for later`
    };
    
    if (action === 'accept') {
      setMatches(prev => [...prev, currentItem]);
      setLastMatch(currentItem);
      setShowMatchModal(true);
      onMatch(currentItem);
    } else if (action === 'pending') {
      setPending(prev => [...prev, currentItem]);
      onPending?.(currentItem);
    } else {
      onPass(currentItem);
    }

    toast({
      title: actionMessages[action],
      duration: 2000,
    });
    
    setCurrentIndex(prev => prev + 1);
  };

  const resetStack = () => {
    setCurrentIndex(0);
    setMatches([]);
    setPending([]);
  };

  if (currentIndex >= data.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Heart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold">You've seen everyone!</h2>
          <p className="text-muted-foreground">
            {matches.length > 0 
              ? `You matched with ${matches.length} ${type}${matches.length === 1 ? '' : 's'}!`
              : `No matches yet. Don't worry, new ${type}s join every day.`
            }
            {pending.length > 0 && (
              <span className="block mt-1">
                You have {pending.length} saved for later.
              </span>
            )}
          </p>
        </div>
        
        <div className="space-y-4">
          {matches.length > 0 && (
            <div className="text-center">
              <h3 className="font-semibold mb-2">Your Matches:</h3>
              <div className="flex flex-wrap gap-2 justify-center max-w-md">
                {matches.map((match, index) => (
                  <Badge key={index} variant="secondary">
                    {match.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {pending.length > 0 && (
            <div className="text-center">
              <h3 className="font-semibold mb-2">Saved for Later:</h3>
              <div className="flex flex-wrap gap-2 justify-center max-w-md">
                {pending.map((item, index) => (
                  <Badge key={index} variant="outline" className="border-yellow-400 text-yellow-700">
                    {item.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <Button onClick={resetStack} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Start Over
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / data.length) * 100}%` }}
        />
      </div>

      {/* Counter */}
      <div className="text-center text-muted-foreground text-sm">
        {currentIndex + 1} of {data.length}
      </div>

      {/* Card stack */}
      <div className="relative">
        {/* Next card preview */}
        {currentIndex + 1 < data.length && (
          <div className="absolute inset-0 z-0 transform scale-95 opacity-50">
            <SwipeCard
              data={data[currentIndex + 1]}
              onSwipe={() => {}}
              type={type}
            />
          </div>
        )}
        
        {/* Current card */}
        <div className="relative z-10">
          <SwipeCard
            data={data[currentIndex]}
            onSwipe={handleSwipe}
            type={type}
          />
        </div>
      </div>

      {/* Match modal */}
      {showMatchModal && lastMatch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-white p-6 max-w-sm w-full text-center space-y-4">
            <div className="text-6xl">🎉</div>
            <h2 className="text-2xl font-bold text-primary">It's a Match!</h2>
            <p className="text-muted-foreground">
              You and {lastMatch.name} are interested in each other!
            </p>
            <Button 
              className="w-full"
              onClick={() => setShowMatchModal(false)}
            >
              Continue Swiping
            </Button>
          </Card>
        </div>
      )}

      {/* Counters */}
      <div className="flex justify-center gap-4">
        {matches.length > 0 && (
          <Badge variant="secondary" className="px-3 py-1">
            <Heart className="h-3 w-3 mr-1" />
            {matches.length} Match{matches.length === 1 ? '' : 'es'}
          </Badge>
        )}
        {pending.length > 0 && (
          <Badge variant="outline" className="px-3 py-1 border-yellow-400 text-yellow-700">
            <Clock className="h-3 w-3 mr-1" />
            {pending.length} Pending
          </Badge>
        )}
      </div>
    </div>
  );
};