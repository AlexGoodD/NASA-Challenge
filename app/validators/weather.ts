import vine from '@vinejs/vine'

export const getWeatherValidator = vine.compile(
  vine.object({
    placeName: vine.string().trim().optional(),
  })
)
