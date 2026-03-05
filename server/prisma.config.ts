import { defineConfig } from 'prisma';
import { PrismaPg } from '@prisma/adapter-pg';

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL as string,
  }),
});
