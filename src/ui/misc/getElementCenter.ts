export function getElementCenter(e: Element) {
  const { left, right, top, bottom } = e.getBoundingClientRect();

  return [(left + right) / 2, (top + bottom) / 2];
}
