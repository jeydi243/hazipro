import { z } from 'zod'

const bodySchema = z.object({
    name: z.string().min(1).optional(),
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
        message: 'PATCH /api/examples — Mise à jour partielle d\'un exemple',
        method: 'PATCH',
        data: parsed.data,
        timestamp: new Date().toISOString()
    }
})
