// src/app/api/forum/route.js
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export async function POST(req) {
  try {
    const body = await req.json();
    const { content, author } = body;

    // Validation
    if (!content || !author) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const newPost = {
      content,
      author,          // should come from frontend (logged-in user)
      likes: 0,
      comments: 0,
      replies: [],
      createdAt: Timestamp.now(),
      date: new Date().toISOString().split("T")[0]
    };

    const docRef = await addDoc(collection(db, "forumPosts"), newPost);

    return new Response(JSON.stringify({ id: docRef.id, ...newPost }), { status: 201 });
  } catch (error) {
    console.error("Error creating forum post:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
