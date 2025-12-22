import { rest } from 'msw'

export const handlers = [
    rest.get('/api/health', (_req, res, ctx) => {
        return res(ctx.status(200))
    }),
]
