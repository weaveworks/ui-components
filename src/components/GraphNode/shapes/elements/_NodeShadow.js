import theme from '../../../../theme';

const NodeShadow = renderTemplate => (
  renderTemplate({
    transform: `scale(${0.49})`,
    style: {
      fill: 'none',
      stroke: theme.colors.white,
      strokeWidth: 0.1,
    },
  })
);

export default NodeShadow;
