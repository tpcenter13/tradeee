// src/app/api/signup/route.js
import { NextResponse } from "next/server";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, email, zone, password, role, photoURL } = body;

    if (!email || !password || !username) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Create user with Firebase Auth (client SDK)
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Update display name / photo
    await updateProfile(userCredential.user, {
      displayName: username,
      photoURL: photoURL || null,
    });

    // Save user data in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      username,
      email,
      zone,
      role,
      photoURL: photoURL || null,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({
      message: "User created successfully",
      uid: userCredential.user.uid,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
