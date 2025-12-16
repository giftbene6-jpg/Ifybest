"use client";

import React, { useState } from "react";
import { Product } from "../../sanity.types";
import StarRating from "./StarRating";

interface ProductRatingSectionProps {
  product: Product;
}

const ProductRatingSection: React.FC<ProductRatingSectionProps> = ({ product }) => {
  const [currentRating, setCurrentRating] = useState(product.rating ?? 0);
  const [ratingCount, setRatingCount] = useState(product.ratingCount ?? 0);

  const handleRatingChange = async (newRating: number) => {
    try {
      const response = await fetch('/api/rating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product._id,
          rating: newRating,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentRating(data.newRating);
        setRatingCount(data.newCount);
      }
    } catch (error) {
      console.error('Failed to update rating:', error);
    }
  };

  return (
    <div className="mt-4 flex items-center gap-2">
      <StarRating rating={currentRating} onChange={handleRatingChange} />
      <span className="text-sm font-semibold text-gray-500">
        ({ratingCount} {ratingCount === 1 ? 'rating' : 'ratings'})
      </span>
    </div>
  );
};

export default ProductRatingSection;
