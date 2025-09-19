import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { RadialProgress } from '@/components/RadialProgress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2, Plus } from 'lucide-react';
import type { Exercise, YogaPose } from '@/types/wellness';

type DayPart = 'morning' | 'afternoon' | 'evening';

interface ScheduleTask {
  id: string;
  name: string;
  duration: string;
  done: boolean;
  preferredTime?: string; // HH:MM
}

interface SimpleTask {
  id: string;
  label: string;
  duration?: string;
  done: boolean;
}

interface UnifiedScheduleProps {
  yoga: YogaPose[];
  exercises: Exercise[];
}

const STORAGE_KEY = 'unifiedSchedule:v1';
const RESET_KEY = 'unifiedSchedule:lastReset';

export const UnifiedSchedule: React.FC<UnifiedScheduleProps> = ({ yoga, exercises }) => {
  // Recommended (read-only) tasks built from props
  const buildRecommended = (): SimpleTask[] => {
    const yogaItems = (yoga || []).slice(0, 3).map(y => ({ id: `yoga-${y.id}`, label: y.name, duration: y.duration, done: false }));
    const exerciseItems = (exercises || []).slice(0, 3).map(e => ({ id: `ex-${e.id}`, label: e.name, duration: e.duration, done: false }));
    return [...yogaItems, ...exerciseItems];
  };

  const [recommended, setRecommended] = useState<SimpleTask[]>(buildRecommended());

  // Custom schedule (CRUD)
  const [tasks, setTasks] = useState<Record<DayPart, ScheduleTask[]>>({
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
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<{ part: DayPart; task: ScheduleTask } | null>(null);
  const [formState, setFormState] = useState<{ part: DayPart; name: string; duration: string; preferredTime: string }>({
    part: 'morning',
    name: '',
    duration: '',
    preferredTime: '',
  });

  // Load persisted state and daily reset
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const lastResetAt = localStorage.getItem(RESET_KEY);
      const now = new Date();
      const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
      if (raw) {
        let parsed = JSON.parse(raw) as { recommended: SimpleTask[]; tasks: Record<DayPart, ScheduleTask[]> };
        let needsReset = true;
        if (lastResetAt) {
          const last = new Date(lastResetAt);
          needsReset = !isSameDay(last, now);
        }
        if (needsReset) {
          parsed = {
            recommended: parsed.recommended.map(r => ({ ...r, done: false })),
            tasks: (Object.keys(parsed.tasks) as DayPart[]).reduce((acc, key) => {
              acc[key] = parsed.tasks[key].map(t => ({ ...t, done: false }));
              return acc;
            }, { morning: [], afternoon: [], evening: [] } as Record<DayPart, ScheduleTask[]>),
          };
          localStorage.setItem(RESET_KEY, now.toISOString());
        }
        setRecommended(parsed.recommended);
        setTasks(parsed.tasks);
      } else {
        localStorage.setItem(RESET_KEY, now.toISOString());
      }
    } catch {}
  }, []);

  // Rebuild recommended when props change, keep done flags if ids match
  useEffect(() => {
    const defaults = buildRecommended();
    setRecommended(prev => {
      const mapPrev = new Map(prev.map(p => [p.id, p]));
      return defaults.map(d => ({ ...d, done: mapPrev.get(d.id)?.done ?? false }));
    });
  }, [yoga, exercises]);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ recommended, tasks }));
    } catch {}
  }, [recommended, tasks]);

  // Combined progress across recommended + custom schedule
  const customAll = useMemo(() => Object.values(tasks).flat(), [tasks]);
  const allCount = recommended.length + customAll.length;
  const doneCount = recommended.filter(r => r.done).length + customAll.filter(t => t.done).length;
  const progress = allCount ? (doneCount / allCount) * 100 : 0;

  const toggleRecommended = (id: string) => {
    setRecommended(prev => prev.map(r => (r.id === id ? { ...r, done: !r.done } : r)));
  };

  const toggleDone = (time: DayPart, id: string) => {
    setTasks(prev => ({
      ...prev,
      [time]: prev[time].map(t => (t.id === id ? { ...t, done: !t.done } : t)),
    }));
  };

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
        [part]: prev[part].map(t => (t.id === editingTask.task.id ? { ...t, name, duration, preferredTime } : t)),
      }));
    } else {
      const newTask: ScheduleTask = { id: crypto.randomUUID(), name, duration, preferredTime, done: false };
      setTasks(prev => ({ ...prev, [part]: [...prev[part], newTask] }));
    }
    setIsDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Day</CardTitle>
        <CardDescription>Recommended tasks and your custom schedule</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <RadialProgress value={progress} size={64} color="#4f46e5" />
            <span className="text-sm">{doneCount} / {allCount} done</span>
          </div>
          <Button size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-1" /> Add session
          </Button>
        </div>

        {/* Recommended Today */}
        <div className="mb-4">
          <h3 className="mb-2 font-semibold">Recommended Today</h3>
          {recommended.length === 0 ? (
            <div className="text-sm text-muted-foreground">No recommendations available.</div>
          ) : (
            recommended.map(item => (
              <div key={item.id} className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggleRecommended(item.id)}
                  className="accent-primary h-4 w-4"
                />
                <span className={item.done ? 'line-through text-muted-foreground' : ''}>{item.label}</span>
                {item.duration ? <Badge variant="outline">{item.duration}</Badge> : null}
              </div>
            ))
          )}
        </div>

        {/* Custom schedule */}
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


