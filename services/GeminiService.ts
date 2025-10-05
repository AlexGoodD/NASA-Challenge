import { z } from 'zod'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import env from '#start/env'

const responseSchema = z.object({
  score: z.number().min(0).max(100),
  justification: z.string().min(10).max(300),
  recommendations: z.array(z.string().min(10).max(100)).min(1).max(5),
})

export default class GeminiService {
  private model

  constructor() {
    this.model = new ChatGoogleGenerativeAI({
      apiKey: env.get('GEMINI_API_KEY'),
      model: 'gemini-2.5-flash',
    }).withStructuredOutput(responseSchema)
  }

  private buildPrompt(
    forecast: string,
    userPlan: string,
    placeName: string,
    dateString: string
  ) {
    return `Eres un asistente experto en evaluar planes de viaje basados en la información meteorológica proporcionada.
    Si el mensaje no tiene sentido, el score debe ser 0.
    Lugar del viaje: ${placeName}
    Fecha del viaje: ${dateString}
    La información meteorológica es la siguiente: ${forecast}
    El plan de viaje del usuario es el siguiente: ${userPlan}`
  }

  public async ask(
    forecast: string,
    userPlan: string,
    placeName: string,
    dateString: string
  ) {
    const prompt = this.buildPrompt(forecast, userPlan, placeName, dateString)
    console.log(prompt)
    return await this.model.invoke(prompt)
  }
}
