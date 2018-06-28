import theme from '../../../../theme';

const NodeBackground = renderTemplate => (
  renderTemplate({
    transform: `scale(${0.48})`,
    style: {
      stroke: 'none',
      fill: theme.colors.white,
    }
  })
);

export default NodeBackground;
