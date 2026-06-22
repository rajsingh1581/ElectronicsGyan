import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, category, details } = data;

    if (!name || !email || !details) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const timestamp = new Date().toISOString();

    // Server-side logging of inquiries
    console.log("\n=============================================");
    console.log("📨 NEW CHATBOT INQUIRY RECEIVED 📨");
    console.log("=============================================");
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Category: ${category}`);
    console.log(`Details:`);
    console.log(`---------------------------------------------`);
    console.log(details);
    console.log(`---------------------------------------------`);

    const smtpUser = process.env.GMAIL_USER;
    const smtpPass = process.env.GMAIL_PASS;

    if (!smtpUser || !smtpPass) {
      console.error("❌ Cannot send email: GMAIL_USER or GMAIL_PASS is not configured in the environment.");
      return NextResponse.json({
        success: false,
        error: "SMTP configuration is missing. Please provide GMAIL_USER and GMAIL_PASS environment variables in the Settings screen.",
        meta: {
          emailSentReal: false,
          smtpError: "Missing environment credentials GMAIL_USER / GMAIL_PASS"
        }
      }, { status: 500 });
    }

    let emailSentSuccessfully = false;
    let smtpErrorDetails: string | null = null;

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const mailOptions = {
        from: `"${name}" <${smtpUser}>`,
        to: "infoelectronics.gyan@gmail.com",
        replyTo: email,
        subject: `AI Assistant Chatbot Inquiry [${category.toUpperCase()}]: ${name}`,
        text: `
You have received a new AI Assistant Chatbot inquiry!

Name: ${name}
Email: ${email}
Category: ${category}

Project Details / Requirements:
${details}

---------------------------------------
Submitted At: ${timestamp}
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log("✅ Direct SMTP Chatbot Inquiry forwarded successfully to infoelectronics.gyan@gmail.com!");
      emailSentSuccessfully = true;
    } catch (smtpError: any) {
      console.error("❌ SMTP forward delivery failed:", smtpError);
      smtpErrorDetails = smtpError?.message || String(smtpError);
    }

    if (!emailSentSuccessfully) {
      return NextResponse.json({
        success: false,
        error: `Gmail SMTP delivery fails: ${smtpErrorDetails}`,
        meta: {
          emailSentReal: false,
          smtpError: smtpErrorDetails,
        }
      }, { status: 500 });
    }

    console.log("=============================================\n");

    return NextResponse.json({ 
      success: true, 
      message: "Chatbot inquiry successfully transmitted directly via Gmail SMTP to infoelectronics.gyan@gmail.com.",
      meta: {
        emailSentReal: true,
        smtpError: null,
      }
    });
  } catch (error: any) {
    console.error("Inquiry logging error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
