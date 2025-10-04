import { test } from '@japa/runner'
import GeminiService from '../../../services/GeminiService.js'

test.group('Gemini Service', () => {
  test('Ask', async ({ assert }) => {
    const weatherInfo = {
      location: 'Paris, France',
      temperature: '18°C',
      condition: 'Partly Cloudy',
      humidity: '60%',
      wind: '10 km/h NW',
    }
    const userPlan =
      'Planeo visitar la Torre Eiffel, el Louvre y pasear por el río Sena. También quiero probar la comida local en varios cafés y restaurantes.'

    const geminiService = new GeminiService()
    const response = await geminiService.ask(JSON.stringify(weatherInfo), userPlan)

    console.log(response)

    assert.isAtLeast(response.score, 0)
    assert.isAtMost(response.score, 100)
    assert.isString(response.justification)
    assert.isAtLeast(response.justification.length, 10)
    assert.isAtMost(response.justification.length, 500)
    assert.isArray(response.recommendations)
    assert.isAtLeast(response.recommendations.length, 1)
    assert.isAtMost(response.recommendations.length, 5)
  }).timeout(20000)
})
