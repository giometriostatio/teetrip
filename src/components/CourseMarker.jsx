import { COLORS } from '../constants.js';

export function createMarkerIcon(type = 'available', selected = false, rank = null) {
  const L = window.L;
  if (!L) return null;

  let color, icon, glowColor, glowSize;
  if (type === 'available') {
    color = COLORS.mastersGreen;
    glowColor = 'rgba(0, 103, 71, 0.5)';
    glowSize = selected ? '0 0 12px 4px' : '0 0 6px 2px';
    icon = `<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${color}"/>
            <circle cx="12" cy="9" r="3" fill="white"/>
            <path d="M11.5 7.5V5.5" stroke="white" stroke-width="1" stroke-linecap="round"/>
            <path d="M11.5 5.5L14 6.5" stroke="white" stroke-width="0.8" fill="none"/>`;
  } else if (type === 'unavailable') {
    color = COLORS.softRed;
    glowColor = 'rgba(255, 71, 87, 0.5)';
    glowSize = selected ? '0 0 12px 4px' : '0 0 8px 3px';
    icon = `<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${color}" opacity="0.85"/>
            <line x1="10" y1="7" x2="14" y2="11" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="14" y1="7" x2="10" y2="11" stroke="white" stroke-width="1.5" stroke-linecap="round"/>`;
  } else {
    color = COLORS.gold;
    // Scale glow intensity by rank: #1 is brightest, #5 is subtlest
    const glowIntensity = rank ? Math.max(0.35, 0.7 - (rank - 1) * 0.08) : 0.6;
    glowColor = `rgba(201, 168, 76, ${glowIntensity})`;
    const baseGlow = rank === 1 ? '0 0 18px 7px' : rank ? '0 0 12px 5px' : '0 0 10px 4px';
    glowSize = selected ? '0 0 20px 8px' : baseGlow;
    if (rank) {
      icon = `<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${color}"/>
              <text x="12" y="10.5" text-anchor="middle" dominant-baseline="central" fill="white" font-size="8" font-weight="bold" font-family="Arial, sans-serif">${rank}</text>`;
    } else {
      icon = `<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${color}"/>
              <path d="M12 6l1.12 2.27 2.5.36-1.81 1.77.43 2.5L12 11.77 9.76 12.9l.43-2.5-1.81-1.77 2.5-.36z" fill="white" stroke="none"/>`;
    }
  }

  // Gold ranked markers are slightly larger; #1 is biggest
  let size, height;
  if (selected) {
    size = 38; height = 53;
  } else if (rank === 1) {
    size = 36; height = 50;
  } else if (rank) {
    size = 33; height = 46;
  } else {
    size = 30; height = 42;
  }
  const selectedClass = selected ? 'marker-selected' : 'marker-pulse';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${height}" viewBox="0 0 24 24" style="filter: drop-shadow(${glowSize} ${glowColor});">${icon}</svg>`;

  return L.divIcon({
    html: `<div class="${selectedClass}">${svg}</div>`,
    className: '',
    iconSize: [size, height],
    iconAnchor: [size / 2, height],
    popupAnchor: [0, -height],
  });
}

export function createPlayerIcon(color) {
  const L = window.L;
  if (!L) return null;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
    <circle cx="12" cy="9" r="2.5" fill="white"/>
    <path d="M7.5 16.5c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5" fill="white"/>
  </svg>`;

  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}
