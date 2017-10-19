
// A linear mapping [a, b] -> [0, 1] (maps value x=a into 0 and x=b into 1).
export function linearGradientValue(x, [a, b]) {
  return (x - a) / (b - a);
}
