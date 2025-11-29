import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle, User, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

interface MatchData {
  candidate_id?: string;
  employer_id?: string;
  candidate_name?: string;
  employer_name?: string;
  company_name?: string;
  job_title?: string;
  candidate_avatar?: string;
  employer_avatar?: string;
}

interface WebbyMatchCelebrationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  match: MatchData | null;
  userType: 'candidate' | 'employer';
  onStartChat?: () => void;
  onViewProfile?: () => void;
}

export const WebbyMatchCelebration = ({
  open,
  onOpenChange,
  match,
  userType,
  onStartChat,
  onViewProfile,
}: WebbyMatchCelebrationProps) => {
  if (!match) return null;

  const otherPartyName = userType === 'candidate' 
    ? (match.company_name || match.employer_name || 'A company')
    : (match.candidate_name || 'A candidate');

  const otherPartyAvatar = userType === 'candidate'
    ? match.employer_avatar
    : match.candidate_avatar;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative p-8 text-center"
        >
          {/* Confetti Effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary rounded-full"
                initial={{
                  x: '50%',
                  y: '50%',
                  scale: 0,
                }}
                animate={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>

          {/* Match Title */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h2 className="text-4xl font-bold mb-2">🎉 It's a Match!</h2>
            <p className="text-muted-foreground">
              You and {otherPartyName} are interested in each other
            </p>
          </motion.div>

          {/* Avatar */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                <AvatarImage src={otherPartyAvatar} />
                <AvatarFallback className="text-2xl">
                  {otherPartyName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-lg">✨</span>
              </div>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-8 p-4 bg-muted/50 rounded-lg"
          >
            <p className="font-medium text-lg">{otherPartyName}</p>
            {match.job_title && (
              <p className="text-sm text-muted-foreground">{match.job_title}</p>
            )}
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-3"
          >
            {onStartChat && (
              <Button onClick={onStartChat} className="w-full gap-2" size="lg">
                <MessageCircle className="w-4 h-4" />
                Start Chatting
              </Button>
            )}
            {onViewProfile && (
              <Button onClick={onViewProfile} variant="outline" className="w-full gap-2" size="lg">
                <User className="w-4 h-4" />
                View Full Profile
              </Button>
            )}
            <Button onClick={() => onOpenChange(false)} variant="ghost" className="w-full gap-2">
              <X className="w-4 h-4" />
              Maybe Later
            </Button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
