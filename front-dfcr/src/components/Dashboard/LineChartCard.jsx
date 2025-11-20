import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, YAxis, ResponsiveContainer } from "recharts";
import { getWorkflowStats } from "../../api/Dashboard/dashboard";

export default function Example() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    async function loadStats() {
      try {
        const stats = await getWorkflowStats();
        console.log("stats", stats);

        // Crée un tableau avec tous les mois, par défaut à 0
        const formatted = months.map((month) => {
          const monthData = stats.find(s => s.month === month);
          return {
            month,
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

  return (
    <div className="md:col-span-4 backdrop-blur-xl bg-[#f5ece3]/50 rounded-3xl p-6 md:p-8 shadow-2xl shadow-[#2d466e]/10 border border-white/20 hover:border-white/40 transition-all duration-500 overflow-hidden min-w-0">
      <div className="mb-4">
        <h3 className="text-lg md:text-xl font-dropline text-[#2d466e]">
          Documents
        </h3>
        <p className="text-xs md:text-sm text-[#73839e]">
          Année 2025
        </p>
      </div>

      {loading ? (
        <div className="text-center text-[#2d466e] font-medium py-6">
          Chargement...
        </div>
      ) : (
        <div className="h-[200px] md:h-[100px] min-h-0 min-w-0 font-necomedium">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid vertical={false} stroke="#73839e20" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tick={{ fill: "#73839e", fontSize: 11, fontWeight: 500, fontFamily: "Eirene Sans" }}
              />
              <YAxis
                tick={{ fill: "#73839e", fontSize: 11, fontWeight: 500, fontFamily: "Eirene Sans" }}
                axisLine={{ stroke: "#73839e50" }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "white", borderRadius: "10px", border: "none", color: "#000", fontWeight: 500 }}
                labelStyle={{ color: "#000", fontWeight: 600 }}
              />

              <Line
                type="monotone"
                dataKey="completed"
                name="Complétés"
                stroke="#2d466e"
                strokeWidth={2}
                dot={{ r: 4, fill: "#f5ece3", stroke: "#2d466e", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />

              <Line
                type="monotone"
                dataKey="refused"
                name="Refusés"
                stroke="#b91c1c"
                strokeWidth={2}
                dot={{ r: 4, fill: "#f5ece3", stroke: "#b91c1c", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
