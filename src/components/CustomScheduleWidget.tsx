import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadialProgress } from '@/components/RadialProgress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface ScheduleTask {
  id: string;
  name: string;
  duration: string;
  done: boolean;
  preferredTime?: string; // HH:MM
}

type DayPart = 'morning' | 'afternoon' | 'evening';

const STORAGE_KEY = 'customScheduleTasks:v1';
const RESET_KEY = 'customScheduleLastResetAt';

const initialTasks: Record<DayPart, ScheduleTask[]> = {
  morning: [
    { id: '1', name: 'Morning Yoga', duration: '30 min', done: false, preferredTime: '07:30' },
    { id: '2', name: 'Healthy Breakfast', duration: '20 min', done: false, preferredTime: '08:15' },
  ],
  afternoon: [
    { id: '3', name: 'Walk', duration: '15 min', done: false, preferredTime: '13:00' },
  ],
  evening: [
    { id: '4', name: 'Meditation', duration: '20 min', done: false, preferredTime: '20:30' },
  ],
};

export const CustomScheduleWidget: React.FC = () => {
  const [tasks, setTasks] = useState<Record<DayPart, ScheduleTask[]>>(initialTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<{ part: DayPart; task: ScheduleTask } | null>(null);
  const [formState, setFormState] = useState<{ part: DayPart; name: string; duration: string; preferredTime: string }>({
    part: 'morning',
    name: '',
    duration: '',
    preferredTime: '',
  });

  // Load from storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const lastResetAt = localStorage.getItem(RESET_KEY);
      const now = new Date();
      let parsed: Record<DayPart, ScheduleTask[]> | null = null;
      if (stored) {
        parsed = JSON.parse(stored);
      }
      // Daily reset: if last reset not today, clear done flags
      const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
      if (parsed) {
        let needsReset = true;
        if (lastResetAt) {
          const last = new Date(lastResetAt);
          needsReset = !isSameDay(last, now);
        }
        if (needsReset) {
          parsed = (Object.keys(parsed) as DayPart[]).reduce((acc, key) => {
            acc[key] = parsed![key].map(t => ({ ...t, done: false }));
            return acc;
          }, { morning: [], afternoon: [], evening: [] } as Record<DayPart, ScheduleTask[]>);
          localStorage.setItem(RESET_KEY, now.toISOString());
        }
        setTasks(parsed);
      } else {
        // Initialize reset timestamp
        localStorage.setItem(RESET_KEY, now.toISOString());
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Persist to storage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // ignore storage errors
    }
  }, [tasks]);

  // Calculate progress
  const allTasks = useMemo(() => Object.values(tasks).flat(), [tasks]);
  const doneCount = useMemo(() => allTasks.filter((t) => t.done).length, [allTasks]);
  const progress = useMemo(() => (allTasks.length ? (doneCount / allTasks.length) * 100 : 0), [allTasks, doneCount]);

  // Toggle done
  const toggleDone = (time: string, id: string) => {
    setTasks((prev) => ({
      ...prev,
      [time]: prev[time].map((t) => t.id === id ? { ...t, done: !t.done } : t),
    }));
  };

  // Add or update task
  const openCreate = () => {
    setEditingTask(null);
    setFormState({ part: 'morning', name: '', duration: '', preferredTime: '' });
    setIsDialogOpen(true);
  };

  const openEdit = (part: DayPart, task: ScheduleTask) => {
    setEditingTask({ part, task });
    setFormState({ part, name: task.name, duration: task.duration, preferredTime: task.preferredTime || '' });
    setIsDialogOpen(true);
  };

  const handleDelete = (part: DayPart, id: string) => {
    setTasks(prev => ({
      ...prev,
      [part]: prev[part].filter(t => t.id !== id),
    }));
  };

  const handleSubmit = () => {
    const { part, name, duration, preferredTime } = formState;
    if (!name.trim() || !duration.trim()) {
      setIsDialogOpen(false);
      return;
    }
    if (editingTask) {
      setTasks(prev => ({
        ...prev,
        [part]: prev[part].map(t => t.id === editingTask.task.id ? { ...t, name, duration, preferredTime } : t),
      }));
    } else {
      const newTask: ScheduleTask = {
        id: crypto.randomUUID(),
        name,
        duration,
        preferredTime,
        done: false,
      };
      setTasks(prev => ({
        ...prev,
        [part]: [...prev[part], newTask],
      }));
    }
    setIsDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Schedule</CardTitle>
        <CardDescription>Fully customizable daily schedule</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <RadialProgress value={progress} size={64} color="#4f46e5" />
            <span className="text-sm">{doneCount} / {allTasks.length} done</span>
          </div>
          <Button size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-1" /> Add session
          </Button>
        </div>
        {(['morning', 'afternoon', 'evening'] as DayPart[]).map((time) => (
          <div key={time} className="mb-3">
            <h3 className="mb-2 font-semibold capitalize">{time}</h3>
            {tasks[time].map((task) => (
              <div key={task.id} className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleDone(time, task.id)}
                  className="accent-primary h-4 w-4"
                />
                <span className={task.done ? 'line-through text-muted-foreground' : ''}>{task.name}</span>
                {task.preferredTime ? (
                  <Badge variant="outline">{task.preferredTime}</Badge>
                ) : null}
                <Badge variant="outline">{task.duration}</Badge>
                <div className="ml-auto flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(time, task)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(time, task.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ))}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {/* Hidden trigger to control open state */}
          <DialogTrigger asChild>
            <span className="hidden" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTask ? 'Edit session' : 'Add session'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="part" className="text-right">Time</Label>
                <div className="col-span-3">
                  <Select value={formState.part} onValueChange={(v) => setFormState(s => ({ ...s, part: v as DayPart }))}>
                    <SelectTrigger id="part">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="afternoon">Afternoon</SelectItem>
                      <SelectItem value="evening">Evening</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" className="col-span-3" value={formState.name} onChange={(e) => setFormState(s => ({ ...s, name: e.target.value }))} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right">Duration</Label>
                <Input id="duration" className="col-span-3" placeholder="e.g. 30 min" value={formState.duration} onChange={(e) => setFormState(s => ({ ...s, duration: e.target.value }))} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="preferredTime" className="text-right">Preferred time</Label>
                <Input id="preferredTime" type="time" className="col-span-3" value={formState.preferredTime} onChange={(e) => setFormState(s => ({ ...s, preferredTime: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>{editingTask ? 'Save changes' : 'Add'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
