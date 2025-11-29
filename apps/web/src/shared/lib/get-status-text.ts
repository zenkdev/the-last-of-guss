export function getStatusText(startAt: Date | string, endAt: Date | string) {
  const now = new Date();
  const startDate = typeof startAt === 'string' ? new Date(startAt) : startAt;
  const endDate = typeof endAt === 'string' ? new Date(endAt) : endAt;

  if (startDate > now) {
    return 'Cooldown';
  }

  if (endDate < now) {
    return 'Завершен';
  }

  return 'Активен';
}
