import { z } from 'zod'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import env from '#start/env'

const responseSchema = z.object({
  score: z.number().min(0).max(100),
  justification: z.string().min(10).max(500),
  recommendations: z.array(z.string().min(10).max(200)).min(1).max(5),
})

export default class GeminiService {
  private model

  constructor() {
    this.model = new ChatGoogleGenerativeAI({
      apiKey: env.get('GEMINI_API_KEY'),
      model: 'gemini-2.5-flash',
    }).withStructuredOutput(responseSchema)
  }

  private buildPrompt(weatherInfo: string, userPlan: string) {
    return `Eres un asistente experto en evaluar planes de viaje basados en la información meteorológica proporcionada.
    La información meteorológica es la siguiente: ${weatherInfo}
    El plan de viaje del usuario es el siguiente: ${userPlan}`
  }

  public async ask(weatherInfo: string, userPlan: string) {
    const prompt = this.buildPrompt(weatherInfo, userPlan)

    return await this.model.invoke(prompt)
  }
}
