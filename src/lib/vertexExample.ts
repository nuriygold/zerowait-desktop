import { GoogleGenAI } from '@google/genai';

/**
 * Example demonstrating how to use Google Cloud Vertex AI endpoints 
 * instead of the developer API (AI Studio). 
 * 
 * Note: To run this in a production web application securely, you should route 
 * requests through a backend service (like Google Cloud Functions or Cloud Run) 
 * to provide the required Google Cloud authentication tokens (ADC), 
 * rather than hardcoding credentials in the client.
 */
export async function initializeVertexAI() {
  // Uses Google Cloud Project and Location for Vertex AI API Calls
  const ai = new GoogleGenAI({
    vertexai: true,
    project: import.meta.env.VITE_GOOGLE_CLOUD_PROJECT || 'zerowait-prod-server',
    location: import.meta.env.VITE_GOOGLE_CLOUD_LOCATION || 'us-central1',
  });

  try {
    // Example of calling the Gemini model securely via Google Cloud Vertex endpoint
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: 'Explain the benefits of zero wait times in clinical settings.',
      config: {
        systemInstruction: 'You are a healthcare operations expert.'
      }
    });

    console.log('Vertex AI Endpoint Response:', response.text);
    return response.text;
  } catch (error) {
    console.error('Vertex AI API Error:', error);
    throw error;
  }
}
