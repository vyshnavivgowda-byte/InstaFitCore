// app/api/send-contact-email/route.ts

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// WARNING: Use an external email service (SendGrid, Resend, Mailgun) for production.
// This example uses a simple Nodemailer setup (e.g., using a Gmail App Password)
// Replace these with your actual email service credentials (e.g., from Resend/SendGrid)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Example: Replace with your SMTP server (e.g., smtp.resend.com)
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,    // Your sender email address (e.g., noreply@yourdomain.com)
    pass: process.env.EMAIL_PASSWORD, // The password or API key for the sender email
  },
});

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Ensure the payload structure matches what the webhook will send
    const { record } = data;
    
    // Check for necessary data
    if (!record || !record.name || !record.email || !record.message) {
        return NextResponse.json({ error: 'Invalid contact record data' }, { status: 400 });
    }

    const { name, email, message, created_at } = record;
    const recipientEmail = 'vyshnavivgowda@gmail.com'; // <--- YOUR TARGET EMAIL ADDRESS

    const mailOptions = {
      from: process.env.EMAIL_USER, // The sender email you configured
      to: recipientEmail,          // Your personal email
      subject: `New Contact Message from ${name} (${email})`,
      html: `
        <p><strong>Date:</strong> ${new Date(created_at).toLocaleString()}</p>
        <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
        <hr/>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap; background: #f4f4f4; padding: 15px; border-radius: 8px;">${message}</p>
        <hr/>
        <p>This message was submitted via the contact form.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log(`Email successfully sent to ${recipientEmail}`);

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Failed to process request or send email' }, { status: 500 });
  }
}