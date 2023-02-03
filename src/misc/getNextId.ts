export function getNextId(map: Map<number, unknown>) {
  for (let i = 0; i < map.size; i++) {
    if (!map.has(i)) {
      return i;
    }
  }

  return map.size;
}
