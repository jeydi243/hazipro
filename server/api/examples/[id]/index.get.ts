export default defineEventHandler(async (event) => {
    await requireAuth(event)

    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID is required'
        })
    }

    return {
        message: 'GET /api/examples/[id] — Récupération d\'un exemple par ID',
        method: 'GET',
        id,
        timestamp: new Date().toISOString()
    }
})
