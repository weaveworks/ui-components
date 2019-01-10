import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import { copyPropTypes } from '../../utils/compose';

const Styled = component => styled(component)`
  background-color: ${props => props.theme.colors.blue200};
  border-radius: ${props => props.theme.borderRadius.soft};
  margin: 4px 0 4px 2px;
  padding: 6px;
  margin-left: 4px;
  display: flex;
  align-items: center;

  i {
    padding-left: 4px;
    cursor: pointer;
  }
`;

class SearchTerm extends React.PureComponent {
  handleRemove = () => {
    this.props.onRemove(this.props.term, this.props.label);
  };

  render() {
    const { className, term, label } = this.props;
    return (
      <li className={`${className} search-term`}>
        <div className="search-term-text">{label || term}</div>
        <i onClick={this.handleRemove} className="fa fa-times remove-term" />
      </li>
    );
  }
}

SearchTerm.propTypes = {
  /**
   * Display value that will be rendered.
   */
  label: PropTypes.string,
  /**
   * Handler that will run when a term is removed.
   * The `term` prop will be passed to the `onRemove` handler.
   */
  onRemove: PropTypes.func,
  /**
   * The internal identifier for a term.
   * If no `label` is supplied, `term` will be rendered.
   */
  term: PropTypes.string.isRequired,
};

SearchTerm.defaultProps = {
  label: '',
  onRemove: noop,
};

export default copyPropTypes(SearchTerm, Styled(SearchTerm));
