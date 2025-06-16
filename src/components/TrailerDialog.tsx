
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface TrailerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  trailerUrl: string;
  movieTitle: string;
}

const TrailerDialog = ({ isOpen, onClose, trailerUrl, movieTitle }: TrailerDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black border-none">
        <div className="relative w-full h-full">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/80 p-2 rounded-full transition-colors"
            aria-label="Close trailer"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          {/* Trailer */}
          <div className="w-full h-full">
            <iframe
              src={trailerUrl}
              title={`${movieTitle} Trailer`}
              className="w-full h-full"
              allowFullScreen
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrailerDialog;
