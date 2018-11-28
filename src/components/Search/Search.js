import React from 'react';
import styled from 'styled-components';
import { map, includes, without, isEmpty, last, noop } from 'lodash';
import PropTypes from 'prop-types';
import requiredIf from 'react-required-if';

import { copyPropTypes } from '../../utils/compose';
import Input from '../Input';
import Dropdown from '../Dropdown';

import Term from './_SearchTerm';

const TermsContainer = styled.ul`
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;

  ${props => props.disabled && 'opacity: 0.75;'};
`;

const Icon = styled.i`
  padding: 0 6px 0 10px;
  ${props => props.disabled && `color: ${props.theme.colors.gray600};`};
`;

const SearchInput = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex: 3;
  width: 100%;
`;

const Styled = component => styled(component)`
  position: relative;
  display: flex;

  ${props =>
    props.disabled && `pointer-events: none;`} background-color: ${props =>
  props.theme.colors[props.disabled ? 'gray50' : 'white']};
  border: 1px solid ${props => props.theme.colors.purple100};
  border-radius: ${props => props.theme.borderRadius.soft};
  font-size: ${props => props.theme.fontSizes.small};
  align-items: center;

  div,
  input {
    border: 0;
  }

  ${Input}, ${Dropdown} {
    padding: 0;
    margin: 0;
  }

  ${Dropdown} {
    flex: 1;
    line-height: 36px;
    border-left: 1px solid ${props => props.theme.colors.gray200};

    .dropdown-popover {
      width: auto;
    }
  }

  ${Input} {
    flex: 2;
    width: 100%;

    input {
      padding: 0 8px;
      width: 100%;
    }

    input:focus {
      outline: none;
    }
  }
`;

class Search extends React.PureComponent {
  addSearchTerm = value => {
    let nextPinnedTerms = this.props.pinnedTerms;
    // only push unique values
    if (!includes(nextPinnedTerms, value)) {
      nextPinnedTerms = [...nextPinnedTerms, value];
      this.props.onPin(nextPinnedTerms);
    }
    this.props.onChange('', nextPinnedTerms);
  };

  removeSearchTerm = value => {
    const nextPinnedTerms = without(this.props.pinnedTerms, value);
    this.props.onChange(this.props.query, nextPinnedTerms);
  };

  handleInputKeyPress = ev => {
    if (ev.key === 'Enter' && this.props.query.length > 0) {
      ev.preventDefault();
      this.addSearchTerm(this.props.query);
    } else if (ev.key === 'Backspace' && this.props.query === '') {
      ev.preventDefault();
      const term = last(this.props.pinnedTerms);
      if (term) {
        // Allow the user to edit the text of the last term instead of removing the whole thing.
        this.removeSearchTerm(term);
      }
    }
  };

  handleInputChange = ev => {
    this.props.onChange(ev.target.value, this.props.pinnedTerms);
  };

  handleFilterChange = (ev, value) => {
    this.input.focus();
    this.props.onFilterSelect(value);
  };

  render() {
    const {
      className,
      filters,
      placeholder,
      query,
      pinnedTerms,
      disabled,
    } = this.props;

    return (
      <div className={className}>
        <Icon className="fa fa-search" disabled={disabled} />
        <SearchInput>
          <TermsContainer disabled={disabled}>
            {map(pinnedTerms, term => (
              <Term key={term} term={term} onRemove={this.removeSearchTerm} />
            ))}
          </TermsContainer>
          <Input
            hideValidationMessage
            onChange={this.handleInputChange}
            value={query}
            onKeyDown={this.handleInputKeyPress}
            onBlur={this.props.onBlur}
            onFocus={this.props.onFocus}
            inputRef={ref => {
              this.input = ref;
            }}
            placeholder={pinnedTerms.length === 0 ? placeholder : null}
            disabled={disabled}
          />
        </SearchInput>

        {!isEmpty(filters) && (
          <Dropdown
            items={filters}
            disabled={disabled}
            placeholder="Filters"
            onChange={this.handleFilterChange}
          />
        )}
      </div>
    );
  }
}

Search.propTypes = {
  /**
   * The initial value to use to populate the search text field.
   * Changes to this prop will be ignored after initial render.
   */
  query: PropTypes.string.isRequired,
  /**
   * The initial pinned terms of the search field.
   * Changes to this prop will be ignored after initial render.
   */
  pinnedTerms: PropTypes.arrayOf(PropTypes.string).isRequired,
  /**
   * Handler that runs when the text input changes.
   * Returns the text as first argument, and the list of pinned terms as the second.
   */
  onChange: PropTypes.func.isRequired,
  /**
   * A list of selectable filters to be rendered in a `<Dropdown />`.
   * When an option is clicked, the `value` is added to the search terms.
   * This array will be passed directly to the `items` prop of the `<Dropdown />.
   * If omitted, no dropdown will be rendered.
   */
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })
  ),
  /**
   * Text that will be passed to the search input as the placeholder.
   */
  placeholder: PropTypes.string,
  /**
   * Disables the component if true
   */
  disabled: PropTypes.bool,
  /**
   * Handler that runs when a search is pinned or unpinned.
   * Returns an array of the currently pinned terms.
   */
  onPin: PropTypes.func,
  /**
   * Handler that runs when an item from the search filter dropdown is selected
   * Returns the selected filter value.
   */
  onFilterSelect: requiredIf(PropTypes.func, props => props.filters.length > 0),
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

Search.defaultProps = {
  placeholder: 'search',
  disabled: false,
  filters: [],
  onFilterSelect: noop,
  onPin: noop,
  onFocus: noop,
  onBlur: noop,
};

export default copyPropTypes(Search, Styled(Search));
