const NodeMetricFill = (renderTemplate, { clipId, metricColor }) =>
  renderTemplate({
    transform: `scale(${0.48})`,
    clipPath: `url(#${clipId})`,
    style: {
      fill: metricColor,
      fillOpacity: 0.7,
      stroke: 'none',
    },
  });

export default NodeMetricFill;
