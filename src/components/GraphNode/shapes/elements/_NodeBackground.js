import theme from '../../../../theme';

const NodeBackground = renderTemplate =>
  renderTemplate({
    style: {
      fill: theme.colors.white,
      stroke: 'none',
    },
    transform: `scale(${0.48})`,
  });

export default NodeBackground;
