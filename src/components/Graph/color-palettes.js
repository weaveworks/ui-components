export function largePalette(index) {
  const colors = [
    'hsl(209, 44%, 83%)',
    'hsl(98, 55%, 81%)',
    'hsl(210, 45%, 74%)',
    'hsl(166, 44%, 65%)',
    'hsl(230, 34%, 66%)',
    'hsl(196, 84%, 52%)', // Weaveworks 'blue accent' color, not interpolated because it looked too dark
    'hsl(240, 20%, 59%)', // Weaveworks 'lavender' color
    'hsl(197, 74%, 43%)',
    'hsl(261, 39%, 44%)',
    'hsl(213, 66%, 40%)',
    'hsl(261, 68%, 29%)',
    'hsl(232, 60%, 36%)',
    'hsl(248, 82%, 11%)', // Weaveworks 'charcoal' color interpolated for 75% opacity
    'hsl(212, 88%, 27%)',
  ];

  return colors[index % colors.length];
}

export function bluePalette(index) {
  // http://colorbrewer2.org/#type=sequential&scheme=YlGnBu&n=9 from d3 without 2 lightest colours
  const colors = [
    'hsl(98, 55%, 81%)',
    'hsl(166, 44%, 65%)',
    'hsl(196, 84%, 52%)', // Weaveworks 'blue accent' color, not interpolated because it looked too dark
    'hsl(197, 74%, 43%)',
    'hsl(213, 66%, 40%)',
    'hsl(232, 60%, 36%)',
    'hsl(212, 88%, 27%)',
  ];
  return colors[index % colors.length];
}

export function purplePalette(index) {
  // http://colorbrewer2.org/#type=sequential&scheme=BuPu&n=9 without 2 lightest colours
  const colors = [
    'hsl(209, 44%, 83%)',
    'hsl(210, 45%, 74%)',
    'hsl(230, 34%, 66%)',
    'hsl(240, 20%, 59%)', // Weaveworks 'lavender' color
    'hsl(286, 41%, 44%)',
    'hsl(303, 79%, 28%)',
    'hsl(248, 82%, 11%)', // Weaveworks 'charcoal' color interpolated for 75% opacity
  ];
  return colors[index % colors.length];
}
