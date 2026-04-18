export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Profile DOB strings may be ISO or locale text; show a readable date when parsable. */
export function formatDobDisplay(dob: string): string {
  const trimmed = (dob || '').trim();
  if (!trimmed) return '—';
  const d = new Date(trimmed);
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }
  return trimmed;
}

export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }
  return formatDate(dateString);
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function initialsFromName(name: string | undefined): string {
  if (!name?.trim()) return 'FG';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Next calendar date that matches the birthday month/day from `dob` (year ignored). */
export function getNextBirthdayDate(dob: string, from: Date = new Date()): Date | null {
  const born = new Date((dob || '').trim());
  if (Number.isNaN(born.getTime())) return null;
  const month = born.getMonth();
  const day = born.getDate();
  const fromNorm = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  let candidate = new Date(fromNorm.getFullYear(), month, day);
  if (candidate < fromNorm) candidate = new Date(fromNorm.getFullYear() + 1, month, day);
  return candidate;
}

/** Whole days from start of `from` until the next birthday date, or null if DOB is invalid. */
export function daysUntilNextBirthday(dob: string, from: Date = new Date()): number | null {
  const next = getNextBirthdayDate(dob, from);
  if (!next) return null;
  const fromNorm = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  return Math.round((next.getTime() - fromNorm.getTime()) / 86400000);
}
