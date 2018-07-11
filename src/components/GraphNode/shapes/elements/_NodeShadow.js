import theme from '../../../../theme';

const NodeShadow = (renderTemplate, contrastMode) =>
  renderTemplate({
    transform: `scale(${0.49})`,
    style: {
      fill: 'none',
      stroke: contrastMode ? theme.colors.white : theme.colors.gray50,
      strokeWidth: contrastMode ? 0.25 : 0.18,
    },
  });

export default NodeShadow;
