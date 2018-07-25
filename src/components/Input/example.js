import React from 'react';
import styled from 'styled-components';

import { Example, Info } from '../../utils/example';

import Input from '.';

const StyledExample = styled(Example)`
  width: 250px;
`;

const isEmail = str => str.indexOf('@') !== -1 && str.indexOf('.') !== -1;

export default class InputExample extends React.Component {
  state = {
    invalidValue: 'invalid-email-that is really long',
    valid: false,
  };

  onChange = e => {
    this.setState({
      invalidValue: e.target.value,
      valid: isEmail(e.target.value),
    });
  };

  render() {
    return (
      <div>
        <StyledExample>
          <Info>Plain inputs</Info>
          <Input label="Username" placeholder="your name here" />
          <Input label="Email" value="ron@hogwarts.edu" />
        </StyledExample>
        <StyledExample>
          <Info>
            With validation <em>(add valid email to clear)</em>
          </Info>
          <Input
            label="Email"
            value={this.state.invalidValue}
            valid={this.state.valid}
            message="Bro, do you even email?"
            onChange={this.onChange}
          />
          <Input label="Password" type="password" />
        </StyledExample>
        <StyledExample>
          <Info>Autoselect</Info>
          <Input
            autoSelectText
            focus
            label="Email"
            value="Autoselect all the things"
          />
        </StyledExample>
      </div>
    );
  }
}
