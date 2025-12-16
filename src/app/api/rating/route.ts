import { backendClient } from "@/sanity/lib/backendClient";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { productId, rating } = await request.json();

    if (!productId || rating === undefined) {
      return NextResponse.json(
        { error: "Missing productId or rating" },
        { status: 400 }
      );
    }

    const product = await backendClient.fetch(
      `*[_type == "product" && _id == $productId][0]{rating, ratingCount}`,
      { productId }
    );

    const currentRating = product?.rating || 0;
    const currentCount = product?.ratingCount || 0;

    const newCount = currentCount + 1;
    const newRating =
      (currentRating * currentCount + rating) / newCount;

    await backendClient
      .patch(productId)
      .set({ rating: newRating, ratingCount: newCount })
      .commit();

    return NextResponse.json({ 
      message: "Rating updated successfully",
      newRating,
      newCount
    });
  } catch (error) {
    console.error("Error updating rating:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
