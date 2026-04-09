import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete?: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onComplete?.(), 500);
    }, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
          data-ocid="loading-screen"
        >
          {/* Glow orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-20 blur-3xl"
              style={{ background: "var(--gradient-primary)" }}
            />
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center gap-6"
          >
            {/* Logo mark */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl glass neon-border flex items-center justify-center animate-pulse-glow">
                <span className="text-3xl font-display font-bold gradient-text">
                  DS
                </span>
              </div>
            </div>

            {/* Brand name */}
            <div className="text-center">
              <h1 className="text-2xl font-display font-bold gradient-text tracking-tight">
                DSWithRavi
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Loading portfolio…
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-48 h-0.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "var(--gradient-primary)" }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.3, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
