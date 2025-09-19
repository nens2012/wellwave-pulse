import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RadialProgress } from '@/components/RadialProgress';

interface ScreenTimeWidgetProps {
  todayMinutes: number;
  weeklyMinutes: number[]; // Array of 7 days
}

export const ScreenTimeWidget: React.FC<ScreenTimeWidgetProps> = ({ todayMinutes, weeklyMinutes }) => {
  const maxMinutes = Math.max(...weeklyMinutes, 1);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Screen Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <RadialProgress value={Math.min((todayMinutes / maxMinutes) * 100, 100)} size={80} color="#f59e42" />
          <div className="text-sm text-muted-foreground">Today: {todayMinutes} min</div>
          <div className="flex gap-2 mt-2">
            {weeklyMinutes.map((min, idx) => (
              <RadialProgress
                key={idx}
                value={Math.min((min / maxMinutes) * 100, 100)}
                size={36}
                color="#f59e42"
              />
            ))}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Weekly trend</div>
        </div>
      </CardContent>
    </Card>
  );
};
