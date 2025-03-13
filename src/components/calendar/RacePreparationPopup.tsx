
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Flag, Timer, Rocket, Calendar } from "lucide-react";
import { format, isPast, isToday, addDays } from "date-fns";

interface RacePreparationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  raceName: string;
  raceDate: string;
  circuit: string;
}

const RacePreparationPopup: React.FC<RacePreparationPopupProps> = ({
  isOpen,
  onClose,
  raceName,
  raceDate,
  circuit
}) => {
  const raceDateTime = new Date(raceDate);
  const isRaceToday = isToday(raceDateTime);
  const isRaceSoon = !isPast(raceDateTime) && !isRaceToday && isPast(addDays(new Date(), 7));
  
  const daysUntilRace = Math.ceil((raceDateTime.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Rocket className="w-5 h-5 text-f1-red mr-2" />
            Prepare for {raceName}!
          </DialogTitle>
          <DialogDescription>
            Get ready for the upcoming race at {circuit}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-blue-500 mr-3" />
            <div>
              <div className="font-medium">Race Date</div>
              <div>{format(raceDateTime, 'EEEE, MMMM dd, yyyy')}</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <Timer className="w-5 h-5 text-orange-500 mr-3" />
            <div>
              <div className="font-medium">Countdown</div>
              <div className="text-lg font-bold">
                {isRaceToday ? (
                  <span className="text-green-500">Today!</span>
                ) : (
                  <span>{daysUntilRace} day{daysUntilRace !== 1 ? 's' : ''} to go</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <Flag className="w-5 h-5 text-purple-500 mr-3" />
            <div>
              <div className="font-medium">Circuit</div>
              <div>{circuit}</div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RacePreparationPopup;
