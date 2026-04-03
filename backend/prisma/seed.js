require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const roles = [
    { description: 'Entrenador', status: true },
    { description: 'Jugador', status: true },
  ];

  for (const rol of roles) {
    const existing = await prisma.rol.findFirst({ where: { description: rol.description } });
    if (!existing) {
      await prisma.rol.create({ data: rol });
      console.log(`✅ Rol creado: ${rol.description}`);
    } else {
      console.log(`⏭️  Rol ya existe: ${rol.description} (id: ${existing.id})`);
    }
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
