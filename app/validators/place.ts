import vine from '@vinejs/vine'

export const searchPlaceValidator = vine.compile(
  vine.object({
    q: vine.string(),
  })
)
