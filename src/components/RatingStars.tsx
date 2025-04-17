import { Star } from "lucide-react";
import React from "react";

function roundToNearestHalf(value: number) {
   const floor = Math.floor(value);
   const decimal = value - floor;

   if (decimal < 0.25) return floor;
   if (decimal < 0.75) return floor + 0.5;
   return floor + 1;
}

export function RatingStars({
   initialRating,
   onRate,
}: {
   initialRating: number;
   onRate?: (rating: number) => void;
}) {
   const roundedInitial = roundToNearestHalf(initialRating);

   const [hovered, setHovered] = React.useState<number | null>(null);
   const [selected, setSelected] = React.useState<number>(roundedInitial);

   const handleClick = (value: number) => {
      setSelected(value);
      onRate?.(value);
   };

   const effectiveRating = hovered ?? selected;

   const renderStar = (index: number) => {
      const isFull = effectiveRating >= index;
      const isHalf = !isFull && effectiveRating + 0.5 >= index;

      return (
         <div
            key={index}
            className="relative h-6 w-6 cursor-pointer"
            onMouseEnter={() => setHovered(isHalf ? index - 0.5 : index)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => handleClick(isHalf ? index - 0.5 : index)}>
            {/* Base star - always yellow background */}
            <Star className="absolute h-6 w-6 text-yellow-400 fill-yellow-400" />

            {/* Gray mask if not full */}
            {!isFull && (
               <Star
                  className="absolute h-6 w-6 text-gray-400 fill-gray-400"
                  style={{
                     clipPath: isHalf ? "inset(0 0 0 50%)" : "inset(0 0 0 0)",
                  }}
               />
            )}
         </div>
      );
   };

   return (
      <div className="flex gap-1 text-gray-400">
         {[1, 2, 3, 4, 5].map((index) => renderStar(index))}
      </div>
   );
}
