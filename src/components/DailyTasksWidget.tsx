import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { RadialProgress } from '@/components/RadialProgress';
import type { Exercise, YogaPose } from '@/types/wellness';

interface TaskItem {
  id: string;
  label: string;
  duration?: string;
  done: boolean;
}

interface DailyTasksWidgetProps {
  yoga: YogaPose[];
  exercises: Exercise[];
}

const STORAGE_KEY = 'dailyTasksWidget:v1';
const RESET_KEY = 'dailyTasksWidget:lastReset';

export const DailyTasksWidget: React.FC<DailyTasksWidgetProps> = ({ yoga, exercises }) => {
  const buildDefaultTasks = (): TaskItem[] => {
    const yogaItems = (yoga || []).slice(0, 3).map((y) => ({
      id: `yoga-${y.id}`,
      label: y.name,
      duration: y.duration,
      done: false,
    }));
    const exerciseItems = (exercises || []).slice(0, 3).map((ex) => ({
      id: `ex-${ex.id}`,
      label: ex.name,
      duration: ex.duration,
      done: false,
    }));
    return [...yogaItems, ...exerciseItems];
  };

  const [tasks, setTasks] = useState<TaskItem[]>(buildDefaultTasks());

  // Load from storage and reset daily
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const lastResetAt = localStorage.getItem(RESET_KEY);
      const now = new Date();
      const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

      if (stored) {
        let parsed: TaskItem[] = JSON.parse(stored);
        let needsReset = true;
        if (lastResetAt) {
          const last = new Date(lastResetAt);
          needsReset = !isSameDay(last, now);
        }
        if (needsReset) {
          parsed = parsed.map(t => ({ ...t, done: false }));
          localStorage.setItem(RESET_KEY, now.toISOString());
        }
        setTasks(parsed);
      } else {
        // Initialize storage with defaults for the day
        const defaults = buildDefaultTasks();
        setTasks(defaults);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
        localStorage.setItem(RESET_KEY, now.toISOString());
      }
    } catch {
      // ignore
    }
    // Rebuild defaults if recommendations change (e.g., age/gender update)
  }, []);

  // If recommendations change at runtime, refresh defaults but keep done state if labels match
  useEffect(() => {
    const defaults = buildDefaultTasks();
    setTasks(prev => {
      const mapPrev = new Map(prev.map(p => [p.id, p]));
      return defaults.map(d => ({ ...d, done: mapPrev.get(d.id)?.done ?? false }));
    });
  }, [yoga, exercises]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  const doneCount = useMemo(() => tasks.filter(t => t.done).length, [tasks]);
  const progress = useMemo(() => (tasks.length ? (doneCount / tasks.length) * 100 : 0), [doneCount, tasks.length]);

  const toggleDone = (id: string) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Tasks</CardTitle>
        <CardDescription>Personalized yoga and exercise for today</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <RadialProgress value={progress} size={64} color="#4f46e5" />
          <span className="text-sm">{doneCount} / {tasks.length} done</span>
        </div>
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleDone(task.id)}
              className="accent-primary h-4 w-4"
            />
            <span className={task.done ? 'line-through text-muted-foreground' : ''}>{task.label}</span>
            {task.duration ? <span className="text-xs text-muted-foreground">{task.duration}</span> : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};


