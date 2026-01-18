'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts';

interface StatsChartsProps {
    stats: {
        mobile: number;
        web: number;
        messages: number;
    };
    messagesData: any[];
}

const COLORS = ['#3B82F6', '#F97316']; // Blue-500, Orange-500

export default function StatsCharts({ stats, messagesData }: StatsChartsProps) {

    // Prepare Pie Data
    const pieData = [
        { name: 'Mobile Apps', value: stats.mobile },
        { name: 'Web Apps', value: stats.web },
    ];

    // Prepare Bar Data (Last 7 Days)
    const getLast7Days = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days.push(d.toISOString().split('T')[0]);
        }
        return days;
    };

    const last7Days = getLast7Days();
    const barData = last7Days.map(date => {
        // Count messages for this date
        const count = messagesData.filter(m => {
            if (!m.createdAt) return false;
            return m.createdAt.startsWith(date);
        }).length;

        // Format date for display (e.g., "Mon", "Jan 01")
        const displayDate = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });

        return {
            name: displayDate,
            messages: count
        };
    });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Project Distribution */}
            <div className="bg-white p-6 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 h-[400px] transition-all duration-300">
                <h3 className="text-gray-500 font-medium mb-6">Project Distribution</h3>
                <ResponsiveContainer width="100%" height="80%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-4">
                    {pieData.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                            <span className="text-sm text-slate-600 font-medium">{entry.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Message Activity */}
            <div className="bg-white p-6 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 h-[400px] transition-all duration-300">
                <h3 className="text-gray-500 font-medium mb-6">Message Activity (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart
                        data={barData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 0,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748B', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748B', fontSize: 12 }}
                            allowDecimals={false}
                        />
                        <Tooltip
                            cursor={{ fill: '#F1F5F9' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar
                            dataKey="messages"
                            fill="#6366F1"
                            radius={[6, 6, 0, 0]}
                            barSize={32}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
