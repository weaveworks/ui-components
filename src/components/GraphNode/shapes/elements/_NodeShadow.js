import theme from '../../../../theme';

const NodeShadow = renderTemplate => (
  renderTemplate({
    transform: `scale(${0.49})`,
    style: {
      fill: 'none',
      stroke: theme.colors.gray50,
      strokeWidth: 0.17,
    },
  })
);

export default NodeShadow;
