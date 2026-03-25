"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

type Category = {
  category: string;
  amount: number;
  color: string;
  percent: number;
};

const DARK_COLORS = ["#F5B040", "#60A5FA", "#A78BFA", "#34D399", "#F472B6", "#64748B"];

export default function SpendingChart({ data }: { data: Category[] }) {
  return (
    <div className="h-52">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="38%"
            cy="50%"
            innerRadius={52}
            outerRadius={80}
            paddingAngle={2}
            dataKey="amount"
            strokeWidth={0}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={DARK_COLORS[index % DARK_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${Number(value).toLocaleString("ru-RU")} KGS`]}
            contentStyle={{
              background: "#0A1628",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              color: "#D4E0EE",
              fontSize: "12px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            }}
            itemStyle={{ color: "#D4E0EE" }}
            labelStyle={{ color: "#7A95B0" }}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconType="circle"
            iconSize={7}
            formatter={(value, entry) => (
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)" }}>
                {value}
                <span style={{ color: "rgba(255,255,255,0.2)", marginLeft: "4px" }}>
                  {(entry.payload as Category).percent}%
                </span>
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
