import theme from '../../../../theme';

const HighlightShadow = renderTemplate =>
  renderTemplate(
    {
      transform: `scale(${0.5})`,
      style: {
        fill: 'none',
        stroke: theme.colors.white,
        strokeWidth: 0.7,
        strokeOpacity: 0.5,
      },
    },
    { allowStroke: false }
  );

export default HighlightShadow;
