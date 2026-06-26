import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Check, X } from 'lucide-react';

export type Student = {
  id: number;
  rollNumber: string;
  name: string;
  gender: string;
  stream: string;
  section: string;
  year: number;
  result?: {
    id: number;
    total: number;
    percentage: number;
    grade: string;
    passOrFail: string;
    rank?: number | null;
  } | null;
};

type Props = {
  data: Student[];
  onUpdate: (id: number, data: any) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

export default function DataGrid({ data, onUpdate, onDelete }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const handleEditClick = (student: Student) => {
    setEditingId(student.id);
    setEditForm({
      name: student.name,
      rollNumber: student.rollNumber,
      section: student.section,
      percentage: student.result?.percentage || '',
      grade: student.result?.grade || '',
      passOrFail: student.result?.passOrFail || '',
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async (id: number) => {
    await onUpdate(id, editForm);
    setEditingId(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-sm text-gray-300">
        <thead className="bg-white/5 text-gray-400 uppercase text-xs font-semibold tracking-wider">
          <tr>
            <th className="px-6 py-4 rounded-tl-lg">Roll No</th>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Section</th>
            <th className="px-6 py-4">Score (%)</th>
            <th className="px-6 py-4">Grade</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-center rounded-tr-lg">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                No student data available.
              </td>
            </tr>
          ) : (
            data.map((student) => {
              const isEditing = editingId === student.id;

              return (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="px-6 py-4 font-medium text-gray-200">
                    {isEditing ? (
                      <input
                        className="w-full bg-background border border-sidebar-border rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                        value={editForm.rollNumber}
                        onChange={(e) => setEditForm({ ...editForm, rollNumber: e.target.value })}
                      />
                    ) : (
                      student.rollNumber
                    )}
                  </td>
                  <td className="px-6 py-4 text-foreground">
                    {isEditing ? (
                      <input
                        className="w-full bg-background border border-sidebar-border rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    ) : (
                      student.name
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {isEditing ? (
                      <input
                        className="w-full bg-background border border-sidebar-border rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                        value={editForm.section}
                        onChange={(e) => setEditForm({ ...editForm, section: e.target.value })}
                      />
                    ) : (
                      student.section
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <input
                        type="number"
                        className="w-full bg-background border border-sidebar-border rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                        value={editForm.percentage}
                        onChange={(e) => setEditForm({ ...editForm, percentage: e.target.value })}
                      />
                    ) : (
                      <span className="text-primary font-medium">{student.result?.percentage ?? '-'}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <input
                        className="w-full bg-background border border-sidebar-border rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                        value={editForm.grade}
                        onChange={(e) => setEditForm({ ...editForm, grade: e.target.value })}
                      />
                    ) : (
                      student.result?.grade ?? '-'
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <select
                        className="w-full bg-background border border-sidebar-border rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                        value={editForm.passOrFail}
                        onChange={(e) => setEditForm({ ...editForm, passOrFail: e.target.value })}
                      >
                        <option value="Pass">Pass</option>
                        <option value="Fail">Fail</option>
                      </select>
                    ) : (
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                        student.result?.passOrFail === 'Pass' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {student.result?.passOrFail ?? '-'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {isEditing ? (
                      <div className="flex justify-center items-center space-x-2">
                        <button onClick={() => handleSave(student.id)} className="p-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-md transition-colors" title="Save">
                          <Check size={16} />
                        </button>
                        <button onClick={handleCancel} className="p-1.5 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded-md transition-colors" title="Cancel">
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEditClick(student)} className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-md transition-colors" title="Edit">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => onDelete(student.id)} className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-md transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </motion.tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
