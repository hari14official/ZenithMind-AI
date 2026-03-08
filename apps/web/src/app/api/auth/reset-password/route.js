import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { email, password, resetToken } = await req.json();

        if (!email || !password || !resetToken) {
            return NextResponse.json({ error: 'Data missing' }, { status: 400 });
        }

        // Mock password update
        console.log(`Password reset for ${email} with token: ${resetToken}`);

        return NextResponse.json({ message: 'Password reset successfully!' });

    } catch (error) {
        console.error('Reset Password Error:', error);
        return NextResponse.json({ error: 'Service Unavailable' }, { status: 500 });
    }
}
