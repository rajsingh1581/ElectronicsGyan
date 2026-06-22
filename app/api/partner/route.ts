import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, phone, location, experience } = data;

    if (!name || !email || !phone || !location || !experience) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const timestamp = new Date().toISOString();

    // Log the incoming partnership application to the server logs
    console.log("\n=============================================");
    console.log("📨 NEW PARTNERSHIP APPLICATION INCOMING 📨");
    console.log("=============================================");
    console.log(`From: ${name} <${email}>`);
    console.log(`Phone: ${phone}`);
    console.log(`Location: ${location}`);
    console.log(`Experience:`);
    console.log(`---------------------------------------------`);
    console.log(experience);
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
        subject: `Partnership Application: ${name}`,
        text: `
You have received a new Partnership Application from the Electronics Gyan app!

Name: ${name}
Email: ${email}
Phone: ${phone}
Location: ${location}

Business Profile / Experience:
${experience}

---------------------------------------
Submitted At: ${timestamp}
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log("✅ Direct SMTP Partnership Email forwarded successfully to infoelectronics.gyan@gmail.com!");
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
      message: "Partnership application successfully transmitted directly via Gmail SMTP to infoelectronics.gyan@gmail.com.",
      meta: {
        emailSentReal: true,
        smtpError: null,
      }
    });

  } catch (error: any) {
    console.error("Partnership Form API Endpoint Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
