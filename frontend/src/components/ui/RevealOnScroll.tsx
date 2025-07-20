import React from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

interface RevealOnScrollProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /**
   * Animation variant to use for the reveal effect
   * - 'fade-up': Fade in with slide up (default)
   * - 'fade': Fade in only
   * - 'slide-up': Slide up only
   * - 'slide-down': Slide down only
   * - 'scale': Scale up with fade
   */
  variant?: 'fade-up' | 'fade' | 'slide-up' | 'slide-down' | 'scale';
  /**
   * Threshold for when the animation should trigger (0-1)
   * 0.1 means trigger when 10% of element is visible
   */
  threshold?: number;
  /**
   * Root margin for triggering the animation
   * Negative values trigger after element enters viewport
   * Positive values trigger before element enters viewport
   */
  rootMargin?: string;
  /**
   * Whether to trigger the animation only once
   */
  triggerOnce?: boolean;
}

const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  delay = 0,
  className,
  variant = 'fade-up',
  threshold = 0.1,
  rootMargin = "-20px 0px",
  triggerOnce = true,
}) => {
  const { ref, inView } = useInView({
    triggerOnce,
    threshold,
    rootMargin,
  });

  // Define animation classes based on variant
  const getAnimationClasses = () => {
    const baseTransition = "transition-all duration-500 ease-out";
    
    switch (variant) {
      case 'fade':
        return {
          base: baseTransition,
          hidden: "opacity-0",
          visible: "opacity-100"
        };
      case 'slide-up':
        return {
          base: baseTransition,
          hidden: "translate-y-4",
          visible: "translate-y-0"
        };
      case 'slide-down':
        return {
          base: baseTransition,
          hidden: "-translate-y-4",
          visible: "translate-y-0"
        };
      case 'scale':
        return {
          base: baseTransition,
          hidden: "opacity-0 scale-95",
          visible: "opacity-100 scale-100"
        };
      case 'fade-up':
      default:
        return {
          base: baseTransition,
          hidden: "opacity-0 translate-y-4",
          visible: "opacity-100 translate-y-0"
        };
    }
  };

  const animationClasses = getAnimationClasses();

  return (
    <div
      ref={ref}
      className={cn(
        animationClasses.base,
        inView ? animationClasses.visible : animationClasses.hidden,
        className
      )}
      style={{ 
        transitionDelay: `${delay}ms`,
        // Ensure the element is not completely invisible during initial render
        // This prevents layout shift issues
        minHeight: inView ? 'auto' : '1px'
      }}
    >
      {children}
    </div>
  );
};

export default RevealOnScroll;
