import React from 'react';
import { useWeeklyEntryStore } from '../../store/weeklyEntryStore';
import { useKPIStore } from '../../store/kpiStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface KPITrendsChartProps {
  filters: {
    department: string;
    startDate: string;
    endDate: string;
    manager: string;
  };
}

export const KPITrendsChart: React.FC<KPITrendsChartProps> = ({ filters }) => {
  const entries = useWeeklyEntryStore((state) => state.entries);
  const kpis = useKPIStore((state) => state.kpis);

  const prepareChartData = () => {
    const weeklyData = entries.reduce((acc, entry) => {
      const week = entry.week;
      if (!acc[week]) {
        // Parse the ISO week string (format: "2024-W01")
        const [year, weekNum] = week.split('-W');
        // Create a date for the Monday of that week
        const date = new Date(parseInt(year), 0, 1 + (parseInt(weekNum) - 1) * 7);
        acc[week] = {
          week: format(date, 'MMM d'),
        };
      }

      entry.kpiEntries.forEach(kpiEntry => {
        const kpi = kpis.find(k => k.id === kpiEntry.kpiId);
        if (kpi) {
          if (!acc[week][kpi.name]) {
            acc[week][kpi.name] = [];
          }
          acc[week][kpi.name].push(kpiEntry.value);
        }
      });

      return acc;
    }, {} as Record<string, any>);

    // Calculate averages and format data for chart
    return Object.values(weeklyData).map(weekData => {
      const formattedData: any = { week: weekData.week };
      Object.entries(weekData).forEach(([key, values]) => {
        if (key !== 'week' && Array.isArray(values)) {
          formattedData[key] = (values as number[]).reduce((a, b) => a + b, 0) / values.length;
        }
      });
      return formattedData;
    });
  };

  const data = prepareChartData();
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00C49F'];

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          KPI Trends Over Time
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              {kpis.map((kpi, index) => (
                <Line
                  key={kpi.id}
                  type="monotone"
                  dataKey={kpi.name}
                  stroke={colors[index % colors.length]}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};