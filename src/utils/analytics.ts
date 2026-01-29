import { Commit } from '../services/index.js';

export interface DayCommitCount {
  date: string;
  count: number;
}

export function groupCommitsByDay(commits: Commit[]): DayCommitCount[] {
  const countMap = new Map<string, { count: number; timestamp: number }>();

  for (const commit of commits) {
    const commitDate = new Date(commit.date);
    // Use local date components to avoid timezone issues
    const year = commitDate.getFullYear();
    const month = commitDate.getMonth();
    const day = commitDate.getDate();
    const dateKey = `${year}-${month}-${day}`;
    const existing = countMap.get(dateKey);
    if (existing) {
      existing.count++;
    } else {
      countMap.set(dateKey, { count: 1, timestamp: commitDate.getTime() });
    }
  }

  return Array.from(countMap.entries())
    .sort((a, b) => a[1].timestamp - b[1].timestamp)
    .map(([, { count, timestamp }]) => ({
      date: new Date(timestamp).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
      count,
    }));
}

export function countWorkingDays(since: Date, until: Date): number {
  let count = 0;
  const current = new Date(since);
  while (current <= until) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
}

export function groupCommitsByWeek(commits: Commit[]): DayCommitCount[] {
  const countMap = new Map<string, number>();

  for (const commit of commits) {
    const date = new Date(commit.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const label = weekStart.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    countMap.set(label, (countMap.get(label) || 0) + 1);
  }

  return Array.from(countMap.entries())
    .map(([date, count]) => ({ date, count }))
    .reverse();
}
