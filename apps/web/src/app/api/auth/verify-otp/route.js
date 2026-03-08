import { NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/otp-store';

export async function POST(req) {
    try {
        const { email, code } = await req.json();

        if (!email || !code) {
            return NextResponse.json({ error: 'Email and code are required' }, { status: 400 });
        }

        // Verify OTP using memory store
        const isVerified = verifyOTP(email, code);

        if (isVerified) {
            // In a real app, generate a secure, short-lived token to be used on the reset password step
            const resetAuthToken = Buffer.from(`${email}:${Date.now() + 600000}`).toString('base64');

            return NextResponse.json({
                message: 'OTP Verified',
                resetToken: resetAuthToken
            });
        }

        return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 });

    } catch (error) {
        console.error('Verify OTP Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
