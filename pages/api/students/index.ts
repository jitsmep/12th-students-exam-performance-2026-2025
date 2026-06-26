import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../src/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const students = await prisma.student.findMany({
        include: { result: true },
        orderBy: { rollNumber: 'asc' },
      });
      res.status(200).json(students);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch students' });
    }
  } else if (req.method === 'POST') {
    // Bulk import
    try {
      const studentsData = req.body; // Array of students
      if (!Array.isArray(studentsData)) {
        return res.status(400).json({ error: 'Body must be an array of students' });
      }

      // Upsert each student (or just insert many, but we'll do upsert to handle updates on re-import)
      for (const item of studentsData) {
        const student = await prisma.student.upsert({
          where: { rollNumber: String(item.rollNumber) },
          update: {
            name: item.name,
            gender: item.gender,
            stream: item.stream,
            section: item.section,
            year: Number(item.year) || new Date().getFullYear(),
          },
          create: {
            rollNumber: String(item.rollNumber),
            name: item.name,
            gender: item.gender || 'Unknown',
            stream: item.stream || 'Unknown',
            section: item.section || 'A',
            year: Number(item.year) || new Date().getFullYear(),
          },
        });

        if (item.total !== undefined || item.percentage !== undefined) {
          await prisma.result.upsert({
            where: { studentId: student.id },
            update: {
              total: Number(item.total) || 0,
              percentage: Number(item.percentage) || 0,
              grade: item.grade || '',
              passOrFail: item.passOrFail || (Number(item.percentage) >= 40 ? 'Pass' : 'Fail'),
              rank: item.rank ? Number(item.rank) : null,
            },
            create: {
              studentId: student.id,
              total: Number(item.total) || 0,
              percentage: Number(item.percentage) || 0,
              grade: item.grade || '',
              passOrFail: item.passOrFail || (Number(item.percentage) >= 40 ? 'Pass' : 'Fail'),
              rank: item.rank ? Number(item.rank) : null,
            },
          });
        }
      }
      res.status(201).json({ message: 'Import successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to import students' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
