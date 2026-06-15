import type { NextFunction, Request, RequestHandler, Response } from 'express'

export function asyncHandler(handler: (req: any, res: Response, next: NextFunction) => unknown | Promise<unknown>): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next)
  }
}
