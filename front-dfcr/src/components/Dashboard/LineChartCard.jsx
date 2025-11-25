import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, YAxis, ResponsiveContainer } from "recharts";
import { getWorkflowStats } from "../../api/Dashboard/dashboard";

export default function Example({ idService }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const stats = await getWorkflowStats(idService);
        
        const formatted = months.map((month) => {
          const monthData = stats.find(s => s.month === month);
          return {
            month: month.substring(0, 3),
            fullMonth: month,
            completed: monthData?.completed || 0,
            refused: monthData?.refused || 0,
          };
        });

        setChartData(formatted);
      } catch (e) {
        console.error("Erreur chargement stats workflow:", e);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="h-full min-h-[350px] backdrop-blur-xl bg-[#f5ece3]/75 rounded-xl p-8 shadow-lg border border-white/20 animate-pulse flex flex-col">
         <div className="h-6 w-1/3 bg-[#2d466e]/10 rounded mb-2"></div>
         <div className="h-4 w-1/4 bg-[#2d466e]/10 rounded mb-8"></div>
         <div className="flex-1 bg-[#2d466e]/5 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-[350px] flex flex-col backdrop-blur-xl bg-[#f5ece3]/75 rounded-xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
      <div className="mb-6 flex justify-between items-end">
        <div>
            <h3 className="text-xl font-dropline text-[#2d466e] font-bold">
            Activité Mensuelle
            </h3>
            <p className="text-sm text-[#73839e] font-eirene mt-1">
            Comparatif validés vs refusés
            </p>
        </div>
        <div className="flex gap-4 text-xs font-medium">
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#2d466e]"></span>
                <span className="text-[#2d466e]">Complétés</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ef4444]"></span>
                <span className="text-[#ef4444]">Refusés</span>
            </div>
        </div>
      </div>

      {/* FIX APPLIED HERE:
          1. Added 'min-w-0' to the div className (Crucial for flex children)
          2. Added 'minWidth={0}' prop to ResponsiveContainer 
      */}
      <div className="flex-1 w-full min-h-[250px] min-w-0">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#73839e20" strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={15}
                tick={{ fill: "#73839e", fontSize: 12, fontWeight: 500, fontFamily: "Eirene Sans" }}
              />
              <YAxis
                tick={{ fill: "#73839e", fontSize: 12, fontWeight: 500, fontFamily: "Eirene Sans" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{ 
                    backgroundColor: "rgba(255, 255, 255, 0.9)", 
                    borderRadius: "12px", 
                    border: "none", 
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    fontFamily: "Eirene Sans"
                }}
                itemStyle={{ fontSize: "12px", fontWeight: 600 }}
                labelStyle={{ color: "#73839e", marginBottom: "5px", fontSize: "12px" }}
                cursor={{ stroke: '#2d466e', strokeWidth: 1, strokeDasharray: '4 4' }}
              />

              <Line
                type="monotone"
                dataKey="completed"
                name="Complétés"
                stroke="#2d466e"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: "#2d466e", stroke: "#fff", strokeWidth: 2 }}
                animationDuration={1500}
              />

              <Line
                type="monotone"
                dataKey="refused"
                name="Refusés"
                stroke="#ef4444"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: "#ef4444", stroke: "#fff", strokeWidth: 2 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
      </div>
    </div>
  );
}