
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'dev.db');
console.log('dbPath:', dbPath);

try {
  const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
  const prisma = new PrismaClient({ adapter });

  (async () => {
    try {
      const totalStudents = await prisma.student.count();
      const passCount = await prisma.result.count({ where: { passOrFail: 'Pass' } });
      const failCount = await prisma.result.count({ where: { passOrFail: 'Fail' } });
      const avgPercentage = await prisma.result.aggregate({
        _avg: { percentage: true },
      });
      const highest = await prisma.result.findFirst({
        orderBy: { percentage: 'desc' },
        include: { student: true },
      });
      const lowest = await prisma.result.findFirst({
        orderBy: { percentage: 'asc' },
        include: { student: true },
      });

      const topStudents = await prisma.result.findMany({
        take: 5,
        orderBy: { percentage: 'desc' },
        include: { student: true },
      });
      
      console.log('Success:', { totalStudents, passCount, failCount });
      process.exit(0);
    } catch(err) {
      console.error('Query error:', err);
      process.exit(1);
    }
  })();
} catch(err) {
  console.error('Init error:', err);
  process.exit(1);
}
