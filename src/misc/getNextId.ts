export function getNextId(list: Map<number, unknown> | Set<number>) {
  for (let i = 0; i < list.size; i++) {
    if (!list.has(i)) {
      return i;
    }
  }

  return list.size;
}
