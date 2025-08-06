import { Link, useLocation } from "wouter";
import { 
  Home, 
  Users, 
  Coins, 
  Trophy, 
  Calendar, 
  Gift, 
  TrendingUp, 
  ShieldCheck,
  Crown,
  Target,
  Gamepad2,
  CreditCard,
  Newspaper,
  Zap
} from "lucide-react";

const menuItems = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/players", label: "Pemain", icon: Users },
  { path: "/currency", label: "Mata Uang", icon: Coins },
  { path: "/ranking", label: "Ranking", icon: Trophy },
  { path: "/tournaments", label: "Turnamen", icon: Calendar },
  { path: "/rewards", label: "Rewards", icon: Gift },
  { path: "/leaderboard", label: "Leaderboard", icon: TrendingUp },
  { path: "/monitoring", label: "Monitoring", icon: ShieldCheck },
  { path: "/game-rooms", label: "Game Rooms", icon: Gamepad2 },
  { path: "/payment-gateway", label: "Payment Gateway", icon: CreditCard },
  { path: "/news", label: "Berita", icon: Newspaper },
  { path: "/xp-boosters", label: "XP Boosters", icon: Zap },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Dobel Domino</h1>
            <p className="text-sm text-slate-400">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 pb-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <li key={item.path}>
                <Link href={item.path}>
                  <div
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3 text-sm text-slate-400">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">A</span>
          </div>
          <div>
            <div className="text-white font-medium">Admin</div>
            <div className="text-xs">Super Administrator</div>
          </div>
        </div>
      </div>
    </div>
  );
}