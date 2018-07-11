const NodeBorder = (renderTemplate, contrastMode, { hasMetric, color }) =>
  renderTemplate({
    stroke: color,
    transform: `scale(${0.5})`,
    style: {
      fill: 'none',
      strokeOpacity: hasMetric ? 0.5 : 1,
      strokeWidth: contrastMode ? 0.15 : 0.1,
    },
  });

export default NodeBorder;
