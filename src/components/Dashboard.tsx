import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  Users,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Award,
  AlertTriangle,
  Star,
  Clock,
  FileSpreadsheet,
  Database
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

type TopStudent = {
  name: string;
  rollNumber: string;
  percentage: number;
  grade: string;
};

type Stats = {
  totalStudents: number;
  passPercentage: number;
  failPercentage: number;
  averagePercentage: number;
  highestPercentage: number;
  lowestPercentage: number;
  topPerformer: string;
  topStudents: TopStudent[];
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    })();
  }, []);

  if (!stats) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const cards = [
    { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-blue-500' },
    { label: 'Pass Rate', value: stats.passPercentage.toFixed(1) + '%', icon: CheckCircle2, color: 'text-emerald-500' },
    { label: 'Fail Rate', value: stats.failPercentage.toFixed(1) + '%', icon: XCircle, color: 'text-rose-500' },
    { label: 'Average Score', value: stats.averagePercentage.toFixed(1) + '%', icon: TrendingUp, color: 'text-amber-500' },
  ];

  const passFailData = [
    { name: 'Pass', value: stats.passPercentage },
    { name: 'Fail', value: stats.failPercentage },
  ];
  const COLORS = ['#10b981', '#f43f5e'];

  const gradeDistribution = [
    { name: 'A+', count: 45 },
    { name: 'A', count: 120 },
    { name: 'B+', count: 150 },
    { name: 'B', count: 100 },
    { name: 'C', count: 50 },
    { name: 'Fail', count: 35 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100 } },
  };

  const mockActivities = [
    { id: 1, action: 'CSV Data Imported', target: '250 students', time: '2 hours ago', icon: FileSpreadsheet, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { id: 2, action: 'Record Updated', target: 'Roll No. 1204', time: '5 hours ago', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { id: 3, action: 'System Backup', target: 'Database', time: '1 day ago', icon: Database, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { id: 4, action: 'New Report Generated', target: 'Class 12A', time: '2 days ago', icon: FileSpreadsheet, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-1"
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-gray-400 text-sm">
          Overview of student performance and recent activity.
        </p>
      </motion.div>

      {/* KPI Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {cards.map((c) => (
          <motion.div key={c.label} variants={itemVariants}>
            <Card className="p-5 glass flex items-center justify-between group">
              <div>
                <p className="text-sm font-medium text-gray-400">{c.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{c.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors ${c.color}`}>
                <c.icon className="w-5 h-5" />
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Charts */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          <Card className="p-6 glass-panel flex flex-col h-[400px]">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground">Grade Distribution</h3>
              <p className="text-sm text-gray-400">Total count of students per grade</p>
            </div>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#18181b', color: '#fff' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} animationDuration={1500}>
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name === 'Fail' ? '#f43f5e' : '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Top Students Table */}
          <Card className="p-6 glass-panel">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Top Performers</h3>
                <p className="text-sm text-gray-400">Highest scoring students</p>
              </div>
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 uppercase bg-white/5">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg rounded-bl-lg">Rank</th>
                    <th className="px-4 py-3">Roll No</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3 text-right">Score</th>
                    <th className="px-4 py-3 text-right rounded-tr-lg rounded-br-lg">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topStudents.map((student, idx) => (
                    <tr key={student.rollNumber} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-300">#{idx + 1}</td>
                      <td className="px-4 py-3 text-gray-400">{student.rollNumber}</td>
                      <td className="px-4 py-3 text-foreground font-medium">{student.name}</td>
                      <td className="px-4 py-3 text-right text-emerald-400 font-semibold">{student.percentage}%</td>
                      <td className="px-4 py-3 text-right">
                        <span className="px-2 py-1 bg-white/10 rounded-md text-xs font-bold text-gray-200">
                          {student.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {stats.topStudents.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-gray-500">No student data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Side Panels */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <Card className="p-6 glass-panel h-[350px] flex flex-col">
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-foreground">Success Ratio</h3>
              <p className="text-sm text-gray-400">Pass vs Fail</p>
            </div>
            
            <div className="flex-1 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={passFailData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    animationDuration={1500}
                  >
                    {passFailData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#18181b', color: '#fff' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    wrapperStyle={{ fontSize: '13px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6 glass-panel flex-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
              <Clock className="w-4 h-4 text-gray-500" />
            </div>
            
            <div className="space-y-6">
              {mockActivities.map((activity, i) => (
                <div key={activity.id} className="flex gap-4 relative">
                  {i !== mockActivities.length - 1 && (
                    <div className="absolute left-[1.15rem] top-10 bottom-[-1.5rem] w-px bg-white/10" />
                  )}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-white/5 ${activity.bg}`}>
                    <activity.icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">{activity.action}</p>
                    <p className="text-xs text-primary mt-0.5">{activity.target}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
