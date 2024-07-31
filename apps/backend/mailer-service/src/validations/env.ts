import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({
  path: '../.././env',
});

export const env = z.object({
    MONGO_URL: z.string()
}).parse(process.env);