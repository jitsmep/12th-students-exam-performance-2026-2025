// src/lib/dashboard.ts
import { prisma } from './prisma';


export async function getDashboardStats() {
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

  return {
    totalStudents,
    passPercentage: totalStudents > 0 ? (passCount / totalStudents) * 100 : 0,
    failPercentage: totalStudents > 0 ? (failCount / totalStudents) * 100 : 0,
    averagePercentage: avgPercentage._avg.percentage ?? 0,
    highestPercentage: highest?.percentage ?? 0,
    lowestPercentage: lowest?.percentage ?? 0,
    topPerformer: highest?.student?.name ?? 'N/A',
    topStudents: topStudents.map(r => ({
      name: r.student.name,
      rollNumber: r.student.rollNumber,
      percentage: r.percentage,
      grade: r.grade,
    })),
  };
}
