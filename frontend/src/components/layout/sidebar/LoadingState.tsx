import React from 'react';
import { Card } from "../../ui/card";
import { cn } from "../../../lib/utils";
import './LoadingState.css';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = "Checking authentication...", className }: LoadingStateProps) {
  return (
    <Card className={cn("p-8 bg-gradient-to-br from-slate-50 to-white border-0 shadow-lg", className)}>
      <div className="flex flex-col items-center space-y-6">
        {/* Book Animation Container */}
        <div className="book-loader">
          <div className="book-loader-inner">
            <ul>
              {Array.from({ length: 6 }, (_, index) => (
                <li key={index} className={`page-${index + 1}`}>
                  <svg fill="currentColor" viewBox="0 0 90 120">
                    <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
                  </svg>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Loading Message */}
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-slate-700">{message}</p>
          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1.5s",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default LoadingState;
