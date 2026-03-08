import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req) {
    try {
        const { question } = await req.json();

        if (!question) {
            return NextResponse.json(
                { answer: 'Please provide a valid question.' },
                { status: 400 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                {
                    answer:
                        "I'm sorry, artificial intelligence answers are currently disabled because the server is missing the Google Gemini API Key. Please configure GEMINI_API_KEY.",
                },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are a helpful support chatbot for ZenithMind.AI, a workplace stress relief and monitoring application. Please answer this user question concisely and politely: ${question}`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        return NextResponse.json({ answer: responseText });
    } catch (error) {
        console.error('Error in chat API route:', error);
        return NextResponse.json(
            { answer: `Error communicating with AI: ${error.message}` },
            { status: 500 }
        );
    }
}
