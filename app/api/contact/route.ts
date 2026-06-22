import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { firstName, lastName, email, subject, project, stream, message } = data;

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const timestamp = new Date().toISOString();

    // Log the incoming message to the server logs
    console.log("\n=============================================");
    console.log("📨 NEW CONTACT FORM INCOMING 📨");
    console.log("=============================================");
    console.log(`From: ${firstName} ${lastName} <${email}>`);
    console.log(`Engineering Stream: ${stream}`);
    console.log(`Project: ${project || "N/A"}`);
    console.log(`Subject Focus: ${subject}`);
    console.log(`Message Content:`);
    console.log(`---------------------------------------------`);
    console.log(message);
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
        from: `"${firstName} ${lastName}" <${smtpUser}>`,
        to: "infoelectronics.gyan@gmail.com",
        replyTo: email,
        subject: `Contact Inquiry [${subject.toUpperCase()}]: ${firstName} ${lastName}`,
        text: `
You have received a new contact inquiry from the Electronics Gyan app!

Name: ${firstName} ${lastName}
Email: ${email}
Engineering Stream: ${stream}
Project Name: ${project || "N/A"}
Subject Focus: ${subject}

Message:
${message}

---------------------------------------
Submitted At: ${timestamp}
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log("✅ Direct SMTP Email forwarded successfully to infoelectronics.gyan@gmail.com!");
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
      message: "Message successfully transmitted directly via Gmail SMTP to infoelectronics.gyan@gmail.com.",
      meta: {
        emailSentReal: true,
        smtpError: null,
      }
    });

  } catch (error: any) {
    console.error("Contact Form API Endpoint Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

