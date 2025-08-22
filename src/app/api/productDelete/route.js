// src/app/api/productDelete/route.js
import { db } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";

export async function DELETE(req) {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return new Response(
        JSON.stringify({ error: "Missing post ID" }),
        { status: 400 }
      );
    }

    await deleteDoc(doc(db, "posts", productId));

    return new Response(
      JSON.stringify({ success: true, id: productId }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}
