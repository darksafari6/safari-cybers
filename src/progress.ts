const key = 'cybersafari.progress.v1';

export interface Progress {
  enrolledPaths: Set<number>;
  completedPaths: Set<number>;
  completedTasksByRoom: Record<number, Set<number>>;
}

function ids(value: unknown): Set<number> {
  return new Set(Array.isArray(value) ? value.filter(id => Number.isSafeInteger(id) && id > 0) : []);
}

export function loadProgress(): Progress {
  try {
    const data = JSON.parse(localStorage.getItem(key) ?? '{}');
    return {
      enrolledPaths: ids(data.enrolledPaths),
      completedPaths: ids(data.completedPaths),
      completedTasksByRoom: Object.fromEntries(
        Object.entries(data.completedTasksByRoom ?? {}).map(([room, tasks]) => [room, ids(tasks)]),
      ),
    };
  } catch {
    return { enrolledPaths: new Set(), completedPaths: new Set(), completedTasksByRoom: {} };
  }
}

export function saveProgress(progress: Progress) {
  try {
    localStorage.setItem(key, JSON.stringify(progress, (_, value) => value instanceof Set ? [...value] : value));
  } catch {
    // Storage can be unavailable; keep the current session usable.
  }
}
