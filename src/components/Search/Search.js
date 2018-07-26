import React from 'react';
import styled from 'styled-components';
import {
  map,
  concat,
  without,
  includes,
  isEmpty,
  debounce,
  last,
  noop,
} from 'lodash';
import PropTypes from 'prop-types';

import { copyPropTypes } from '../../utils/compose';
import Input from '../Input';
import Dropdown from '../Dropdown';

import Term from './_SearchTerm';

// Don't make functions async if we are running tests
const timeout = (cb, t) => {
  if (process.env.NODE_ENV === 'test') {
    return cb;
  }

  return debounce(cb, t);
};

const TermsContainer = styled.ul`
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
`;

const Icon = styled.i`
  line-height: 34px;
  padding: 0 8px;
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
  background-color: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.purple100};
  border-radius: ${props => props.theme.borderRadius.soft};

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
    border-left: 1px solid ${props => props.theme.colors.gray200};
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

    div {
      margin: 0;
    }
  }
`;

class Search extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    this.doSearch = timeout(this.doSearch.bind(this), 200);
  }

  state = {
    text: this.props.initialQuery,
    terms: this.props.initialPinnedTerms,
  };

  addSearchTerm = (ev, value) => {
    if (!includes(this.state.terms, value)) {
      // only push unique values
      this.setState(
        { terms: concat(...this.state.terms, value) },
        this.doPinSearchTerm
      );
    }
    this.setState({ text: '' }, this.doSearch);
  };

  removeSearchTerm = value => {
    const terms = without(this.state.terms, value);
    this.setState({ terms }, this.doPinSearchTerm);
  };

  handleInputKeyPress = ev => {
    if (ev.key === 'Enter' && this.state.text.length > 0) {
      ev.preventDefault();
      this.addSearchTerm(ev, this.state.text);
    }

    if (ev.key === 'Backspace' && this.state.text === '') {
      ev.preventDefault();
      const term = last(this.state.terms);
      if (term) {
        // Allow the user to edit the text of the last term instead of removing the whole thing.
        this.setState({ text: term }, () => this.removeSearchTerm(term));
      }
    }
  };

  handleInputChange = ev => {
    this.setState({ text: ev.target.value }, this.doSearch);
  };

  handleInputBlur = ev => {
    // If the input loses focus, pin the search term. Skip if input is empty.
    if (this.state.text) {
      this.addSearchTerm(ev, this.state.text);
    }
    this.props.onBlur(ev);
  };

  handleFilterChange = (ev, value) => {
    this.input.focus();
    this.addSearchTerm(ev, value);
  };

  doPinSearchTerm() {
    this.props.onChange(this.state.text, this.state.terms);
    this.props.onPin(this.state.terms);
  }

  doSearch() {
    this.props.onChange(this.state.text, this.state.terms);
  }

  render() {
    const { className, filters, placeholder } = this.props;
    const { terms, text } = this.state;

    return (
      <div className={className}>
        <Icon className="fa fa-search" />
        <SearchInput>
          <TermsContainer>
            {map(terms, term => (
              <Term key={term} term={term} onRemove={this.removeSearchTerm} />
            ))}
          </TermsContainer>
          <Input
            hideValidationMessage
            onChange={this.handleInputChange}
            value={text}
            onKeyDown={this.handleInputKeyPress}
            onBlur={this.handleInputBlur}
            onFocus={this.props.onFocus}
            inputRef={ref => {
              this.input = ref;
            }}
            placeholder={terms.length === 0 ? placeholder : null}
          />
        </SearchInput>

        {!isEmpty(filters) && (
          <Dropdown
            items={filters}
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
  initialQuery: PropTypes.string,
  /**
   * The initial pinned terms of the search field.
   * Changes to this prop will be ignored after initial render.
   */
  initialPinnedTerms: PropTypes.arrayOf(PropTypes.string),
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
   * Handler that runs when the text input changes.
   * Returns the text as first argument, and the list of pinned terms as the second.
   */
  onChange: PropTypes.func,
  /**
   * Handler that runs when a search is pinned or unpinned.
   * Returns an array of the currently pinned terms.
   */
  onPin: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

Search.defaultProps = {
  filters: [],
  initialQuery: '',
  initialPinnedTerms: [],
  placeholder: '',
  onPin: noop,
  onChange: noop,
  onFocus: noop,
  onBlur: noop,
};

export default copyPropTypes(Search, Styled(Search));
