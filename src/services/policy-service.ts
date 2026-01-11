export interface SentimentDistribution {
  support: number;
  neutral: number;
  oppose: number;
}

export interface DeepSentiment {
  insight: string;
  reasoning: string;
}

export interface ThemePillar {
  theme: string;
  mentions: number;
  summary: string;
}

export interface Innovation {
  idea: string;
  context: string;
}

export interface DashboardReport {
  vibe_check: SentimentDistribution;
  deep_sentiment: DeepSentiment;
  theme_map: ThemePillar[];
  innovation_spotter: Innovation[];
}

import { getApiBaseUrl } from '../config/api';

const API_URL = `${getApiBaseUrl(8001)}/analyze`;

export const DEMO_COMMENTS = [
  "The smoke from the Northside chemical plant is getting unbearable on Tuesday mornings. My kids have started coughing more.",
  "I support the new emission regulations, but we need to ensure local jobs aren't lost if the factory slows down.",
  "Why are there no trash bins near the river? People just dump their industrial waste there because it's convenient.",
  "The smell of burning plastic near the landfill is a daily nightmare for residents in the East District.",
  "I think the factory is doing its best; they provide 500 jobs to this town. Let's not be too hasty with fines.",
  "We need a sensor network around the industrial zone to track air quality in real-time, not just annual inspections.",
  "Solid waste dumping in the wetlands is destroying the local bird population. 15 of us saw a truck yesterday but couldn't get the plates.",
  "If we close the factory for pollution, who is going to pay my mortgage? The mayor?",
  "There's a specific drainage pipe near Elm Street that leaks black liquid every time it rains. It's missing from the official city map.",
  "I suggest using specialized \"bio-filtration\" plants in the drainage basins near factories to catch chemical runoff before it hits the river.",
  "The traffic from the garbage trucks starts at 4 AM and the noise is just as bad as the pollution.",
  "Parents are organizing a protest because the factory's expansion is planned right next to the new primary school playground.",
  "Could we offer tax credits to factories that switch to solar-powered filtration systems? It's better than just punishing them.",
  "Industrial waste is being mixed with regular household trash at the South Point center. It's a huge safety hazard.",
  "I neutral on the pollution issue as long as my electricity bills don't go up because of new 'green' taxes.",
  "The heavy metals in the soil near the old foundry are a silent killer. We need a town hall meeting now!",
  "I've lived here 40 years and the air was never this bad. The 'Mayor's Plan' feels like a wall of text with no real action.",
  "One resident suggested using \"crushed recycled glass\" in the pavement of the industrial road to handle heavy truck wear and reduce dust.",
  "The factory needs a better perimeter wall to keep the noise and dust away from the adjacent residential blocks.",
  "We should have a public dashboard (like this one!) where we can see the factory's daily compliance scores."
];

export async function analyzeComments(comments: string[] = DEMO_COMMENTS): Promise<DashboardReport> {
  try {
    console.log('Sending policy analysis request to:', API_URL);
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comments }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} at ${API_URL}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing pulse:', error);
    throw error;
  }
}
