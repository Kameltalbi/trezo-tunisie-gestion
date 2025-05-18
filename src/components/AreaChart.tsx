
import React from "react";
import { 
  Area, 
  AreaChart as RechartsAreaChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

interface AreaChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
}

export function AreaChart({
  data,
  index,
  categories,
  colors = ["violet"],
  valueFormatter = (value: number) => `${value}`,
  className,
}: AreaChartProps) {
  return (
    <ChartContainer className={className} config={{}}>
      <RechartsAreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          {categories.map((category, i) => (
            <linearGradient key={category} id={`color-${category}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors[i % colors.length]} stopOpacity={0.8} />
              <stop offset="95%" stopColor={colors[i % colors.length]} stopOpacity={0.1} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={index} />
        <YAxis />
        <ChartTooltip 
          formatter={(value: number) => valueFormatter(value)}
        />
        {categories.map((category, i) => (
          <Area
            key={category}
            type="monotone"
            dataKey={category}
            stroke={colors[i % colors.length]}
            fillOpacity={1}
            fill={`url(#color-${category})`}
          />
        ))}
      </RechartsAreaChart>
    </ChartContainer>
  );
}
