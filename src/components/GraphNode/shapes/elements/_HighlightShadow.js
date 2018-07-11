import theme from '../../../../theme';

const HighlightShadow = (renderTemplate, contrastMode) =>
  renderTemplate(
    {
      transform: `scale(${0.5})`,
      style: {
        fill: 'none',
        stroke: theme.colors.white,
        strokeOpacity: contrastMode ? 0.4 : 0.5,
        strokeWidth: 0.7,
      },
    },
    { allowStroke: false }
  );

export default HighlightShadow;
