export const dynamic = "force-dynamic";

import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let postsQuery = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc")
    );

    // Filter by category if provided
    if (category && category !== "All Items") {
      postsQuery = query(
        collection(db, "posts"),
        where("category", "==", category),
        orderBy("createdAt", "desc")
      );
    }

    const querySnapshot = await getDocs(postsQuery);
    const posts = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        category: data.category,
        quantity: data.quantity,
        images: data.images,
        isSelling: data.isSelling,
        price: data.price,
        tradeFor: data.tradeFor,
        seller: data.seller,
        zone: data.zone,
        createdAt: data.createdAt?.toDate?.() || new Date(),
      });
    });

    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch posts" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
