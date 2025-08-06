import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconBgColor?: string;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  iconBgColor = "bg-blue-100",
  subtitle,
  trend 
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center">
        <div className={`${iconBgColor} rounded-lg p-3`}>
          <Icon className="w-6 h-6 text-slate-700" />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-sm font-medium text-slate-600">{title}</h3>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-slate-500">{subtitle}</p>
          )}
          {trend && (
            <p className={`text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.value}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}