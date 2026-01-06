import dotenv from 'dotenv'
import {PrismaClient} from './generated/prisma/client.js';
import {PrismaPg} from '@prisma/adapter-pg';
dotenv.config();

const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaPg({connectionString})

const prismaClient = new PrismaClient({adapter});

export {prismaClient};