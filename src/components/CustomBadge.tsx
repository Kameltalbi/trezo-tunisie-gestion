
import React from 'react';
import { DollarSign } from 'lucide-react';

const CustomBadge = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-full shadow-lg transition-colors cursor-pointer">
        <DollarSign className="h-5 w-5" />
      </div>
    </div>
  );
};

export default CustomBadge;
