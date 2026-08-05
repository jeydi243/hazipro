export default defineEventHandler(async (event) => {
    await requireAuth(event)

    return {
        message: 'DELETE /api/examples — Suppression d\'un exemple',
        method: 'DELETE',
        timestamp: new Date().toISOString()
    }
})
