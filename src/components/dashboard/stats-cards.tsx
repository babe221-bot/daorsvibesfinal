import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, ListMusic, Music } from "lucide-react";

const STATS = [
  {
    title: "Total Songs",
    value: "1,257",
    change: "+20.1% from last month",
    icon: <Music className="h-4 w-4 text-gray-300" />,
  },
  {
    title: "Total Playlists",
    value: "23",
    change: "+180.1% from last month",
    icon: <ListMusic className="h-4 w-4 text-gray-300" />,
  },
  {
    title: "Activity",
    value: "+573",
    change: "+201 since last week",
    icon: <Activity className="h-4 w-4 text-gray-300" />,
  },
  {
    title: "Recently Played",
    value: "573",
    change: "+201 since last hour",
    icon: <Clock className="h-4 w-4 text-gray-300" />,
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mb-8">
      {STATS.map((stat, index) => (
        <Card
          key={stat.title}
          className="glass-card"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-gray-400">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
