import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Upload, RefreshCcw } from 'lucide-react';
import Papa from 'papaparse';
import DataGrid, { Student } from '@/components/DataGrid';

export default function DataManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const res = await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(results.data),
          });

          if (res.ok) {
            alert('Import successful!');
            await fetchStudents();
          } else {
            alert('Import failed.');
          }
        } catch (error) {
          console.error(error);
          alert('Error during import.');
        } finally {
          setImporting(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      },
    });
  };

  const handleUpdate = async (id: number, data: any) => {
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result: data, ...data }), // Send flattened data
      });
      if (res.ok) {
        await fetchStudents();
      } else {
        alert('Failed to update student');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setStudents(students.filter((s) => s.id !== id));
      } else {
        alert('Failed to delete student');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <Head>
        <title>Data Management | EduDash</title>
      </Head>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Data Management</h1>
          <p className="text-gray-400 text-sm mt-1">Import and edit student performance data</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => fetchStudents()}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-foreground rounded-lg font-medium transition-colors flex items-center border border-white/10 text-sm"
          >
            <RefreshCcw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors flex items-center shadow-lg shadow-primary/20 disabled:opacity-50 text-sm"
          >
            <Upload size={16} className="mr-2" />
            {importing ? 'Importing...' : 'Import CSV'}
          </button>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </motion.div>

      {/* Data Grid Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        {loading && students.length === 0 ? (
          <div className="flex justify-center items-center h-64 border border-sidebar-border bg-card rounded-xl">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="glass-panel p-1 rounded-xl overflow-hidden shadow-2xl border border-white/10">
            <DataGrid data={students} onUpdate={handleUpdate} onDelete={handleDelete} />
          </div>
        )}
      </motion.div>
    </div>
  );
}
