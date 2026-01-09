export const buildDaySlots = () => {
  const slots: string[] = [];
  for (let hour = 7; hour <= 22; hour += 1) {
    slots.push(`${`${hour}`.padStart(2, '0')}:00`);
    if (hour < 22) {
      slots.push(`${`${hour}`.padStart(2, '0')}:30`);
    }
  }
  return slots;
};

export const groupSlots = (slots: string[]) => {
  const groups = {
    morning: [] as string[],
    afternoon: [] as string[],
    evening: [] as string[]
  };
  slots.forEach((slot) => {
    const hour = Number(slot.split(':')[0]);
    if (hour < 12) groups.morning.push(slot);
    else if (hour < 18) groups.afternoon.push(slot);
    else groups.evening.push(slot);
  });
  return groups;
};
