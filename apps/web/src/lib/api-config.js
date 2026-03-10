const getBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
    if (typeof window !== 'undefined') return window.location.origin;
    return 'http://127.0.0.1:8000';
};

export const API_BASE_URL = getBaseUrl();
export const WS_BASE_URL = API_BASE_URL.replace('http', 'ws');
