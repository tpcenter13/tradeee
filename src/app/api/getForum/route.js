// src/app/api/forum/route.js
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, "forumPosts"));
    const posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate().toISOString() // Convert Firestore Timestamp to ISO string
    }));
    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (error) {
    console.error("Error fetching forum posts:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

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
      author, // This should come from the authenticated user
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