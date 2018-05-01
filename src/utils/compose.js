export function copyPropTypes(source, target) {
  target.propTypes = { ...source.propTypes };
  target.defaultProps = { ...source.defaultProps };

  return target;
}
