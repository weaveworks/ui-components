
const NodeBorder = (renderTemplate, { color }) => (
  renderTemplate({
    stroke: color,
    transform: `scale(${0.5})`,
    style: {
      fill: 'none',
      strokeOpacity: 1,
      strokeWidth: 0.1,
    },
  })
);

export default NodeBorder;
