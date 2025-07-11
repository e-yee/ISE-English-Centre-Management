import React, { useState } from "react";
import Header from "./Header";
import { Button } from "@/components/ui/button";

const HeaderExample: React.FC = () => {
  const [isRegistered, setIsRegistered] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header isRegistered={isRegistered} />
      
      {/* Demo Content */}
      <div className="container mx-auto p-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Header Variant Demo
          </h1>
          
          <p className="text-gray-600 mb-6 text-center">
            Toggle between the default header and the registered user header variant.
          </p>
          
          <div className="flex flex-col gap-4">
            <Button
              onClick={() => setIsRegistered(false)}
              variant={!isRegistered ? "default" : "outline"}
              className="w-full"
            >
              Default Header
            </Button>
            
            <Button
              onClick={() => setIsRegistered(true)}
              variant={isRegistered ? "default" : "outline"}
              className="w-full"
            >
              Registered Header
            </Button>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Current State:</h3>
            <p className="text-sm text-gray-600">
              {isRegistered ? "Registered User Header" : "Default Header"}
            </p>
            
            {isRegistered && (
              <div className="mt-2 text-xs text-gray-500">
                <p>Features available:</p>
                <ul className="list-disc list-inside ml-2">
                  <li>Search functionality</li>
                  <li>Theme toggle (Light/Dark)</li>
                  <li>Notification bell</li>
                  <li>User profile access</li>
                  <li>"How to use?" guide</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderExample;
