import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, Timestamp } from "firebase/firestore";

export async function POST(req) {
  try {
    const body = await req.json();
    const { 
      productId, 
      reportType, 
      description, 
      reportedBy, 
      productTitle, 
      sellerEmail 
    } = body;

    // Validation
    if (!productId || !reportType || !description || !reportedBy) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields", 
          required: ["productId", "reportType", "description", "reportedBy"] 
        }), 
        { status: 400 }
      );
    }

    // Validate report type
    const validReportTypes = [
      "Scam/Fraud",
      "Inappropriate Content", 
      "Fake Product",
      "Misleading Information",
      "Prohibited Item",
      "Spam",
      "Other"
    ];

    if (!validReportTypes.includes(reportType)) {
      return new Response(
        JSON.stringify({ error: "Invalid report type" }), 
        { status: 400 }
      );
    }

    // Validate description length
    if (description.length < 10 || description.length > 500) {
      return new Response(
        JSON.stringify({ error: "Description must be between 10 and 500 characters" }), 
        { status: 400 }
      );
    }

    // Check for duplicate reports (same user reporting same product)
    const reportsRef = collection(db, "reports");
    const duplicateQuery = query(
      reportsRef,
      where("productId", "==", productId),
      where("reportedBy", "==", reportedBy)
    );
    
    const duplicateSnapshot = await getDocs(duplicateQuery);
    if (!duplicateSnapshot.empty) {
      return new Response(
        JSON.stringify({ 
          error: "You have already reported this product",
          reportId: duplicateSnapshot.docs[0].id 
        }), 
        { status: 409 }
      );
    }

    // Get report priority
    const getReportPriority = (type) => {
      const highPriorityTypes = ["Scam/Fraud", "Prohibited Item"];
      const mediumPriorityTypes = ["Fake Product", "Misleading Information"];
      
      if (highPriorityTypes.includes(type)) return "high";
      if (mediumPriorityTypes.includes(type)) return "medium";
      return "low";
    };

    // Prepare report data
    const newReport = {
      productId,
      reportType,
      description: description.trim(),
      reportedBy,
      productTitle: productTitle || "Unknown Product",
      sellerEmail: sellerEmail || "Unknown Seller",
      status: "pending", // pending, under_review, resolved, dismissed
      priority: getReportPriority(reportType),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // Save report to Firestore
    const docRef = await addDoc(collection(db, "reports"), newReport);

    // Log successful report submission
    console.log(`New report submitted: ${docRef.id} - ${reportType} for product ${productId}`);

    // Send notification for high priority reports
    if (newReport.priority === "high") {
      console.log(`🚨 HIGH PRIORITY REPORT: ${reportType} - Product: ${productTitle}`);
      // You can add email/Slack notification here later
      // await notifyAdmins(newReport);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Report submitted successfully",
        reportId: docRef.id,
        status: "pending"
      }), 
      { status: 201 }
    );

  } catch (error) {
    console.error("Error submitting report:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Server error", 
        message: "Failed to submit report. Please try again." 
      }), 
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    // This endpoint can be used by admins to view reports
    const url = new URL(req.url);
    const status = url.searchParams.get("status") || "all";
    const productId = url.searchParams.get("productId");
    
    // Add authentication check here for admin access
    // const user = await verifyAdminUser(req);
    // if (!user || !user.isAdmin) {
    //   return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    // }

    let reportsQuery = collection(db, "reports");
    
    // Filter by status if specified
    if (status !== "all") {
      reportsQuery = query(reportsQuery, where("status", "==", status));
    }
    
    // Filter by productId if specified
    if (productId) {
      reportsQuery = query(reportsQuery, where("productId", "==", productId));
    }

    const querySnapshot = await getDocs(reportsQuery);
    const reports = [];
    
    querySnapshot.forEach((doc) => {
      reports.push({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamp to ISO string for JSON response
        createdAt: doc.data().createdAt?.toDate()?.toISOString(),
        updatedAt: doc.data().updatedAt?.toDate()?.toISOString(),
      });
    });

    // Sort by creation date (newest first)
    reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return new Response(
      JSON.stringify({
        success: true,
        reports,
        total: reports.length,
        filters: { status, productId }
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

// You can add this function later for admin notifications
/*
async function notifyAdmins(reportData) {
  try {
    // Example: Send email notification
    // const nodemailer = require('nodemailer');
    // const transporter = nodemailer.createTransporter({...});
    // await transporter.sendMail({
    //   to: process.env.ADMIN_EMAIL,
    //   subject: `High Priority Report: ${reportData.reportType}`,
    //   html: `
    //     <h2>High Priority Report Submitted</h2>
    //     <p><strong>Product:</strong> ${reportData.productTitle}</p>
    //     <p><strong>Report Type:</strong> ${reportData.reportType}</p>
    //     <p><strong>Description:</strong> ${reportData.description}</p>
    //     <p><strong>Reported By:</strong> ${reportData.reportedBy}</p>
    //     <p><strong>Seller:</strong> ${reportData.sellerEmail}</p>
    //   `
    // });

    console.log("Admin notification sent for high priority report");
  } catch (error) {
    console.error("Failed to notify admins:", error);
  }
}
*/