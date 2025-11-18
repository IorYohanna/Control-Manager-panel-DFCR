import React from "react";
import { TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

export default function Example() {
  return (
    <div className="md:col-span-4 backdrop-blur-xl bg-white/10 rounded-3xl p-6 md:p-8 shadow-2xl shadow-[#2d466e]/10 border border-white/20 hover:border-white/40 transition-all duration-500 overflow-hidden">

      <div className="mb-4">
        <h3 className="text-lg md:text-xl font-dropline text-[#2d466e]">
          Documents
        </h3>
        <p className="text-xs md:text-sm text-[#73839e]">
          January - June 2024
        </p>
      </div>

      {/* Chart responsive */}
      <div className="w-full h-[220px] md:h-[300px] font-necomedium">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="#73839e20"
              strokeDasharray=""
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{
                fill: "#73839e",
                fontSize: 11,
                fontWeight: 500,
                fontFamily: "Eirene Sans",
              }}
              tickFormatter={(v) => v.slice(0, 3)}
            />

            <YAxis
              tick={{
                fill: "#73839e",
                fontSize: 11,
                fontWeight: 500,
                fontFamily: "Eirene Sans",
              }}
              axisLine={{ stroke: "#73839e50" }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "10px",
                border: "none",
                color: "#000000",
                fontWeight: 500,
              }}
              labelStyle={{ color: "#000000", fontWeight: 600 }}
            />

            <Line
              type="monotone"
              dataKey="desktop"
              stroke="#2d466e"
              strokeWidth={2}
              dot={{ r: 4, fill: "#f5ece3", stroke: "#2d466e", strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-col gap-1 text-xs md:text-sm text-[#73839e]">
        <div className="flex items-center gap-2 font-medium text-[#2d466e]">
          Améliorons ensemble notre travail <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-[#73839e]">
          Montre le nombre de documents terminés au cours des 6 mois
        </div>
      </div>

    </div>
  );
}
