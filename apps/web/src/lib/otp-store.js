// Temporary in-memory OTP store with expiration logic
// Format: { email: { code: string, expires: number } }
const otpStore = new Map();

export function setOTP(email, code, durationMs = 300000) { // Default 5 mins
    const expires = Date.now() + durationMs;
    otpStore.set(email, { code, expires });
}

export function verifyOTP(email, code) {
    if (!otpStore.has(email)) return false;

    const entry = otpStore.get(email);
    const now = Date.now();

    // Check expiration
    if (now > entry.expires) {
        otpStore.delete(email);
        return false;
    }

    // Check code
    if (entry.code === code) {
        otpStore.delete(email); // One-time use
        return true;
    }

    return false;
}
