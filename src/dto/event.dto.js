export const eventDTO = (event) => {
  if (!event) return null;
  const source = typeof event.toObject === 'function' ? event.toObject() : event;
  return { ...source, availableCapacity: Math.max(source.capacity - (source.reserved || 0), 0) };
};
