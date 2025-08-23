import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";
    const productId = searchParams.get("productId");

    let constraints = [];
    if (status !== "all") {
      constraints.push(where("status", "==", status));
    }
    if (productId) {
      constraints.push(where("productId", "==", productId));
    }

    const reportsQuery = constraints.length > 0
      ? query(collection(db, "reports"), ...constraints)
      : query(collection(db, "reports"));

    const snapshot = await getDocs(reportsQuery);

    const reports = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        reportedUser: {
          name: data.sellerName || data.reportedUser?.name || "Unknown User",
          email: data.sellerEmail || data.reportedUser?.email || "N/A",
          zone: data.zone || data.reportedUser?.zone || "N/A"
        },
        reportedBy: {
          name: data.reporterName || data.reportedBy?.name || "Anonymous",
          email: data.reporterEmail || data.reportedBy?.email || "N/A"
        },
        reason: data.reportType || data.reason || "N/A",
        date: data.createdAt?.toDate()?.toISOString() || data.date || new Date().toISOString(),
        status: data.status || "Pending",
        message: data.description || data.message || "No message provided",
        priority: data.priority || "Medium"
      };
    });

    reports.sort((a, b) => new Date(b.date) - new Date(a.date));

    return new Response(
      JSON.stringify({
        success: true,
        reports,
        total: reports.length,
        filters: { status, productId },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching reports:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch reports" }),
      { status: 500 }
    );
  }
}