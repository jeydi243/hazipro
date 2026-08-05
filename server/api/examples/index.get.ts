export default defineEventHandler(async (event) => {
    await requireAuth(event)

    return {
        message: 'GET /api/examples — Liste des exemples',
        method: 'GET',
        timestamp: new Date().toISOString()
    }
})
