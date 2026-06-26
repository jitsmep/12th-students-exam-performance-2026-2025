import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../src/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  const studentId = parseInt(id, 10);

  if (req.method === 'PUT') {
    try {
      const { name, rollNumber, gender, stream, section, year, result } = req.body;

      // Update student
      const updatedStudent = await prisma.student.update({
        where: { id: studentId },
        data: {
          name,
          rollNumber,
          gender,
          stream,
          section,
          year: year ? parseInt(year, 10) : undefined,
        },
      });

      // Update result if provided
      if (result) {
        await prisma.result.upsert({
          where: { studentId },
          update: {
            total: result.total !== undefined ? parseInt(result.total, 10) : undefined,
            percentage: result.percentage !== undefined ? parseFloat(result.percentage) : undefined,
            grade: result.grade,
            passOrFail: result.passOrFail,
            rank: result.rank !== undefined ? parseInt(result.rank, 10) : null,
          },
          create: {
            studentId,
            total: parseInt(result.total || '0', 10),
            percentage: parseFloat(result.percentage || '0'),
            grade: result.grade || '',
            passOrFail: result.passOrFail || (parseFloat(result.percentage) >= 40 ? 'Pass' : 'Fail'),
            rank: result.rank ? parseInt(result.rank, 10) : null,
          },
        });
      }

      const completeStudent = await prisma.student.findUnique({
        where: { id: studentId },
        include: { result: true },
      });

      res.status(200).json(completeStudent);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update student' });
    }
  } else if (req.method === 'DELETE') {
    try {
      // Must delete related records first due to foreign keys, or use Prisma's onDelete: Cascade (but we assume it's not cascaded in schema)
      await prisma.result.deleteMany({
        where: { studentId },
      });
      await prisma.marks.deleteMany({
        where: { studentId },
      });
      await prisma.student.delete({
        where: { id: studentId },
      });
      res.status(204).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete student' });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
