// instafitcore/src/app/api/send-otp/route.ts
// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';
import { supabase } from '@/lib/supabase-client';  // Adjust path if needed

export async function POST(request: NextRequest) {
  const { email, mode } = await request.json(); // mode: 'login' or 'register'

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  // Generate 4-digit numeric OTP
  const otp = otpGenerator.generate(4, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });

  // Store OTP in Supabase
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // expires in 5 minutes
  const { error: insertError } = await supabase
    .from('otp_codes')
    .insert([{ email, otp, expires_at: expiresAt }]);

  if (insertError) {
    console.error('Error storing OTP:', insertError);
    return NextResponse.json({ error: 'Failed to generate OTP' }, { status: 500 });
  }

  // Send email with OTP
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or use SendGrid, etc.
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // app password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: mode === 'register' ? 'Your 4-Digit Signup Code' : 'Your 4-Digit Login Code',
    text: `Your 4-digit code is: ${otp}. It expires in 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send OTP email' }, { status: 500 });
  }
}
