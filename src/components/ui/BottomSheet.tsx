import React from 'react';
import { AnimatePresence, motion } from 'motion/react';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ open, onClose, children }) => {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-100 bg-black/70 backdrop-blur-sm flex items-end md:items-center md:justify-center" onMouseDown={onClose}>
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full md:max-w-lg bg-[#161616] border border-[#262626] rounded-t-3xl md:rounded-3xl shadow-2xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 rounded-full bg-white/10 mx-auto mt-3 mb-2 md:hidden" />
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

