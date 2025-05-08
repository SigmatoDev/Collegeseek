// import React, { useState } from 'react';

// const SlidingButton: React.FC = () => {
//   const [isOn, setIsOn] = useState(false);

//   const toggleButtons = () => {
//     setIsOn(!isOn);
//   };

//   return (
//     <button
//       onClick={toggleButtons}
//       className={`relative inline-flex items-center w-16 h-8 rounded-full transition duration-300 
//         ${isOn ? 'bg-green-500' : 'bg-gray-300'}`}
//     >
//       <span
//         className={`absolute w-7 h-7 bg-white rounded-full transition-transform duration-300 
//           ${isOn ? 'transform translate-x-8' : 'transform translate-x-1'}`}
//       ></span>
//       <span className={`absolute text-sm text-white ${isOn ? 'left-2' : 'right-2'}`}>
//         {isOn ? 'ON' : 'OFF'}
//       </span>
//     </button>
//   );
// };

// const CollegeFeatureToggle: React.FC = () => {
//   return (
//     <div className="flex flex-col space-y-3">
//       <label className="text-lg font-semibold">Featured College</label>
//       <SlidingButton />
//     </div>
//   );
// };

// export default CollegeFeatureToggle;
import { useState, useEffect } from 'react';

interface FeaturedProps {
  initialFeatured?: boolean;
  onToggleFeatured: (isFeatured: boolean) => void;
}

const FeaturedComponent: React.FC<FeaturedProps> = ({ initialFeatured = false, onToggleFeatured }) => {
  const [isFeatured, setIsFeatured] = useState<boolean>(initialFeatured);

  useEffect(() => {
    console.log("🟡 Prop changed: initialFeatured =", initialFeatured);
    setIsFeatured(initialFeatured); // ✅ NO negation
  }, [initialFeatured]);

  // Debug local state
  // useEffect(() => {
  //   console.log("🔵 Local isFeatured state =", isFeatured);
  // }, [isFeatured]);

  useEffect(() => {
    console.log('isFeatured state in FeaturedComponent:', isFeatured);
  }, [isFeatured]);

  const toggleFeatured = (event: React.MouseEvent) => {
    event.preventDefault();
    const newState = !isFeatured;
    setIsFeatured(newState);
    onToggleFeatured(newState);
  };

  return (
    <div className="flex flex-col space-y-4">
      <p className="text-xl font-medium">Featured College</p>
      <div className="relative">
        <button
          onClick={toggleFeatured}
          className={`w-16 h-8 rounded-full flex items-center p-1 cursor-pointer transition-all duration-300 ${
            isFeatured ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          <div
            className={`w-6 h-6 bg-white rounded-full transition-all duration-300 ${
              isFeatured ? 'translate-x-8' : ''
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default FeaturedComponent;








