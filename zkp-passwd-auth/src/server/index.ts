// src/server/index.ts
import express    from 'express';
import cors       from 'cors';
import dotenv     from 'dotenv';
import { router, } from './routes/auth.js';
import { selfTest } from '../shared/ed25519.js';

dotenv.config();
selfTest();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/', router);
app.listen(Number(process.env.PORT) || 3000, () =>
  console.log('Serveur ZKP démarré sur http://localhost:3000')
);