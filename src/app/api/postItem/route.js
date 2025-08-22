import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, description, category, quantity, images, isSelling, price, tradeFor, seller, zone } = body;

    // Validation
    if (!title || !description || !zone || !category || !quantity || !images || images.length < 3 || !seller) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const newPost = {
      title,
      description,
      category,
      quantity,
      images,
      isSelling,
      price: isSelling ? price : null,
      tradeFor: !isSelling ? tradeFor : null,
      createdAt: Timestamp.now(),
      seller,
      zone,
    };

    const docRef = await addDoc(collection(db, "posts"), newPost);

    return new Response(JSON.stringify({ id: docRef.id, ...newPost }), { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
