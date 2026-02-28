const axios = require('axios');
const DiagnosisLog = require('../models/DiagnosisLog');
const ErrorResponse = require('../utils/errorResponse');

// A generic function to call an AI API (e.g. OpenAI/Gemini)
// and gracefully fallback to mock data if it fails or there is no API key
const callAIProvider = async (prompt, systemInstruction = 'You are a helpful medical assistant.') => {
    try {
        if (!process.env.OPENAI_API_KEY) {
            console.log('No AI API key found. Using fallback mock data.');
            return simulateFallback(prompt);
        }

        // Suppose we are calling OpenAI Chat Completions API
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: systemInstruction },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.3
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const aiText = response.data.choices[0].message.content;

        let structuredData;
        try {
            // Attempt to parse JSON if we asked for structured output
            structuredData = JSON.parse(aiText);
        } catch (e) {
            structuredData = { text: aiText };
        }

        return { data: structuredData, isFallback: false };
    } catch (error) {
        console.error('AI API call failed:', error.message);
        console.log('Falling back to local static response...');
        return simulateFallback(prompt);
    }
};

const simulateFallback = (prompt) => {
    // Graceful fallback structured JSON response
    return {
        data: {
            alert: 'This is a simulated AI response due to API unavailability.',
            analysis: 'Based on the input provided, please consult a real doctor for an exact diagnosis or explanation.',
            receivedPromptLength: prompt.length,
            confidence: 'Low (Fallback mode)'
        },
        isFallback: true
    };
};

exports.symptomCheck = async (symptoms, userId) => {
    // AI instruction for structured JSON output
    const instruction = 'You are a medical assistant. Analyze the symptoms and output ONLY a JSON object with keys: "possibleConditions" (array of strings), "urgency" (string: low, medium, high), "recommendation" (string).';

    // Call AI
    const result = await callAIProvider(`Symptoms: ${symptoms}`, instruction);

    // Save to DiagnosisLog
    const log = await DiagnosisLog.create({
        userId,
        action: 'symptom-check',
        prompt: symptoms,
        aiResponse: result.data,
        isFallback: result.isFallback
    });

    return result.data;
};

exports.prescriptionExplain = async (prescriptionText, userId) => {
    // AI instruction for structured JSON output
    const instruction = 'You are a medical assistant. Explain the prescription in simple layman terms. Output ONLY a JSON object with keys: "medicinesExplained" (array of objects {name, purpose, instructions}), "generalAdvice" (string).';

    // Call AI
    const result = await callAIProvider(`Prescription: ${prescriptionText}`, instruction);

    // Save to DiagnosisLog
    const log = await DiagnosisLog.create({
        userId,
        action: 'prescription-explain',
        prompt: prescriptionText,
        aiResponse: result.data,
        isFallback: result.isFallback
    });

    return result.data;
};
