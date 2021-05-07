import { Request, Response } from 'express';

export type ExpressHandleFunction = (req: Request, res: Response) => void;
