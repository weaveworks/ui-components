const NodeBorder = (renderTemplate, contrastMode, { hasMetric, color }) =>
  renderTemplate({
    stroke: color,
    style: {
      fill: 'none',
      strokeOpacity: hasMetric ? 0.5 : 1,
      strokeWidth: contrastMode ? 0.15 : 0.12,
    },
    transform: `scale(${0.5})`,
  });

export default NodeBorder;
