
'use client';
import { useEffect, useState } from "react";

const StrathmallLoading = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev === "..." ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="flex items-center justify-center space-x-2">
        <div className="text-blue-500 text-3xl font-bold">Strathmall</div>
        <div className="w-6 h-6 flex items-center justify-center">
          <div className="animate-bounce w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
        </div>
      </div>
      <div className="mt-4 p-6 rounded-lg shadow-lg w-1/3 bg-white text-center">
        <p className="text-gray-600">Loading{dots}</p>
      </div>
    </div>
  );
};

export default StrathmallLoading;
