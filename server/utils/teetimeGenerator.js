function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}

function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export function generateTeeTimes(placeId, dateString, courseRating = 3.5) {
  const seedStr = `${placeId}::${dateString}`;
  const seed = hashCode(seedStr);
  const rand = seededRandom(Math.abs(seed));

  const availabilityRoll = rand();
  const isAvailable = availabilityRoll < 0.7;

  if (!isAvailable) {
    return { available: false, teeTimes: [] };
  }

  const date = new Date(dateString + 'T00:00:00');
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  const prestige = Math.min(Math.max(courseRating / 5, 0.3), 1.0);

  const teeTimes = [];
  let currentMinutes = 360;
  const endMinutes = 17 * 60;

  while (currentMinutes < endMinutes) {
    const hours = Math.floor(currentMinutes / 60);
    const mins = currentMinutes % 60;
    const timeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;

    let basePrice = 35;
    if (hours < 8) basePrice = 30;
    else if (hours < 11) basePrice = 55;
    else if (hours < 14) basePrice = 50;
    else if (hours < 16) basePrice = 40;
    else basePrice = 30;

    const weekendMultiplier = isWeekend ? 1.4 : 1.0;
    const prestigeMultiplier = 0.5 + prestige * 1.5;
    const variance = 0.85 + rand() * 0.3;

    let price = Math.round(
      basePrice * weekendMultiplier * prestigeMultiplier * variance
    );
    price = Math.max(25, Math.min(150, price));

    const slotRoll = rand();
    let slots;
    if (slotRoll < 0.15) slots = 1;
    else if (slotRoll < 0.35) slots = 2;
    else if (slotRoll < 0.65) slots = 3;
    else slots = 4;

    const skipRoll = rand();
    if (skipRoll > 0.2) {
      teeTimes.push({
        time: timeStr,
        price,
        slots,
        holes: 18,
      });
    }

    const interval = 8 + Math.floor(rand() * 5);
    currentMinutes += interval;
  }

  return { available: true, teeTimes };
}
