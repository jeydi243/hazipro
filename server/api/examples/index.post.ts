import { z } from 'zod'

const bodySchema = z.object({
    name: z.string().min(1),
    description: z.string().optional()
})

export default defineEventHandler(async (event) => {
    await requireAuth(event)

    const body = await readBody(event)
    const parsed = bodySchema.safeParse(body)

    if (!parsed.success) {
        throw createError({
            statusCode: 400,
            statusMessage: parsed.error.issues.map(i => i.message).join(', ')
        })
    }

    return {
        message: 'POST /api/examples — Création d\'un exemple',
        method: 'POST',
        data: parsed.data,
        timestamp: new Date().toISOString()
    }
})
