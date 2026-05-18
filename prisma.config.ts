import { config } from "dotenv"
import { defineConfig } from "prisma/config"
import { resolve } from "path"
import fs from "fs"

const envLocalPath = resolve(__dirname, ".env.local")
if (fs.existsSync(envLocalPath)) {
  config({ path: envLocalPath })
}

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set in environment or .env.local")
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
})
