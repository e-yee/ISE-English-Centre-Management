// import * as React from "react";

// import { cn } from "@/lib/utils";

// export interface InputProps
//   extends React.InputHTMLAttributes<HTMLInputElement> {}

// const Input = React.forwardRef<HTMLInputElement, InputProps>(
//   ({ className, type, ...props }, ref) => {
//     return (
//       <input
//         type={type}
//         className={cn(
//           "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
//           className
//         )}
//         ref={ref}
//         {...props}
//       />
//     );
//   }
// );
// Input.displayName = "Input";

// export { Input };


import * as React from "react";

import { cn } from "@/lib/utils"; // Assumes you have this utility for merging class names

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // --- Start of New Refactored Classes ---
          // These are the new defaults for the pill-shaped input.
          "flex h-12 w-full rounded-full border-2 border-black bg-white px-4 text-gray-700 placeholder:text-gray-500",
          
          // --- New Focus Behavior ---
          // Removes the ring and default outline on focus.
          "focus:outline-none focus:border-black focus:ring-0",

          // --- Kept for functionality ---
          // Sensible defaults for file and disabled states.
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "disabled:cursor-not-allowed disabled:opacity-50",
          // --- End of New Refactored Classes ---
          
          // This allows you to still override styles on a case-by-case basis.
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

