// Command import removed as we are using HTTP fetch

interface PollutionDetails {
  label: string;
  score: number;
  pollution_type: string;
  box?: [number, number, number, number];
  source: string;
}

export interface AnalysisResult {
  pollution_type: string;
  confidence_level: number;
  legal_draft: string;
  details: PollutionDetails[];
  error?: string;
}

import { getApiBaseUrl } from '../config/api';

const API_URL = `${getApiBaseUrl(8000)}/analyze`;

export async function analyzeImage(imageUrl: string, originalFilename?: string): Promise<AnalysisResult> {
  try {
    console.log('Analyzing image via HTTP:', imageUrl);

    const formData = new FormData();
    formData.append('image_url', imageUrl);
    if (originalFilename) {
      formData.append('original_filename', originalFilename);
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }

    const result = await response.json() as AnalysisResult;
    console.log('Analysis result:', result);
    return result;

  } catch (error) {
    console.error('Error analyzing image:', error);
    return {
      pollution_type: 'Error',
      confidence_level: 0,
      legal_draft: 'Failed to analyze image due to a connection error. Is the Python server running?',
      details: [],
      error: String(error)
    };
  }
}
