import theme from '../../../../theme';

const HighlightBorder = (renderTemplate, contrastMode) =>
  renderTemplate(
    {
      transform: `scale(${0.5})`,
      style: {
        fill: 'none',
        stroke: theme.colors.blue400,
        strokeOpacity: contrastMode ? 0.5 : 0.4,
        strokeWidth: contrastMode ? 1 : 0.8,
      },
    },
    { allowStroke: false }
  );

export default HighlightBorder;
