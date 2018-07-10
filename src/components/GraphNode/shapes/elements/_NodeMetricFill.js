const NodeMetricFill = (renderTemplate, { clipId, metricColor }) =>
  renderTemplate({
    transform: `scale(${0.48})`,
    clipPath: `url(#${clipId})`,
    style: {
      fill: metricColor,
      opacity: 0.5,
    },
  });

export default NodeMetricFill;
