import vine from '@vinejs/vine'

export const getWeatherValidator = vine.compile(
  vine.object({
    placeName: vine.string().trim().optional(),
  })
)

export const predictWeatherViabilityValidator = vine.compile(
  vine.object({
    placeName: vine.string().trim(),
    date: vine.string().trim(),
    userPlan: vine.string().trim(),
    weatherInformation: vine.record(
      vine.unionOfTypes([vine.string(), vine.number(), vine.boolean()])
    ),
  })
)
