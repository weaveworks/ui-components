
const NodeBackground = renderTemplate => (
  renderTemplate({
    transform: `scale(${0.48})`,
    style: {
      stroke: 'none',
      fill: 'white',
    }
  })
);

export default NodeBackground;
