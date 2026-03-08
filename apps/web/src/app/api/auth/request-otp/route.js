import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { setOTP } from '@/lib/otp-store';

// Rate limiting map (in-memory)
const rateLimitMap = new Map();

export async function POST(req) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Basic Rate Limiting: 1 request per 60 seconds per email
        const now = Date.now();
        if (rateLimitMap.has(email)) {
            const lastRequest = rateLimitMap.get(email);
            if (now - lastRequest < 60000) {
                return NextResponse.json({ error: 'Too many requests. Please wait 60 seconds.' }, { status: 429 });
            }
        }
        rateLimitMap.set(email, now);

        // Generate 6-digit random code
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP with 5-minute expiration
        setOTP(email, code, 300000);

        // Send Email (Mocking success for now if transporter credentials are not real)
        // In a real environment, you'd want to handle this with a production email provider.
        const mailOptions = {
            from: `"ZenithMind AI" <${process.env.EMAIL_USER || 'zenithmindai.verify@gmail.com'}>`,
            to: email,
            subject: 'Your Password Reset OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #6366f1;">ZenithMind.AI</h2>
                    <p style="font-size: 16px; color: #333;">Hello,</p>
                    <p style="font-size: 16px; color: #333;">You requested a password reset for your account. Please use the following 6-digit code to complete the verification process:</p>
                    <div style="background: #f3f4f6; color: #6366f1; font-size: 32px; font-weight: bold; text-align: center; padding: 15px; border-radius: 8px; margin: 25px 0; letter-spacing: 5px;">
                        ${code}
                    </div>
                    <p style="font-size: 14px; color: #666;">This code will expire in 5 minutes. If you did not request this, please ignore this email.</p>
                    <p style="font-size: 14px; color: #666; margin-top: 20px;">Stay Mindful,<br/>The ZenithMind AI Team</p>
                </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            return NextResponse.json({ message: 'OTP sent to your email' });
        } catch (mailError) {
            console.error('SMTP Mail Error:', mailError);
            return NextResponse.json({
                error: `Mail delivery failed: ${mailError.message || 'Check your SMTP settings'}`
            }, { status: 500 });
        }

    } catch (error) {
        console.error('Request OTP Error:', error);
        return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
    }
}
