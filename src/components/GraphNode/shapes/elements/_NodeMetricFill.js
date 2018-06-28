
// TODO: Make this meaningful.
const getMetricColor = () => '#000';

const NodeMetricFill = (renderTemplate, { clipId, metric }) => (
  renderTemplate({
    transform: `scale(${0.48})`,
    clipPath: `url(#${clipId})`,
    style: {
      fill: getMetricColor(metric),
    },
  })
);

export default NodeMetricFill;
