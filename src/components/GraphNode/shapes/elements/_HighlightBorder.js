import theme from '../../../../theme';

const HighlightBorder = renderTemplate => (
  renderTemplate({
    transform: `scale(${0.5})`,
    style: {
      fill: 'none',
      stroke: theme.colors.blue400,
      strokeWidth: 0.8,
      strokeOpacity: 0.5,
    }
  })
);

export default HighlightBorder;
