import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor = "bg-blue-100",
  trend,
}: StatsCardProps) {
  const iconTextColor = iconBgColor.replace("100", "600");

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
              <span className="mr-1">
                {trend.isPositive ? "↑" : "↓"}
              </span>
              {trend.value}
            </p>
          )}
          {subtitle && !trend && (
            <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          <Icon className={`${iconTextColor} text-xl w-6 h-6`} />
        </div>
      </div>
    </div>
  );
}
