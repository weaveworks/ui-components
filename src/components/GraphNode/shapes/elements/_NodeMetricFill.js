const NodeMetricFill = (renderTemplate, { clipId, metricColor }) =>
  renderTemplate({
    clipPath: `url(#${clipId})`,
    style: {
      fill: metricColor,
      fillOpacity: 0.7,
      stroke: 'none',
    },
    transform: `scale(${0.48})`,
  });

export default NodeMetricFill;
