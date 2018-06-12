import React from 'react';
import { trim } from 'lodash';
import styled from 'styled-components';

import { Example, Info } from '../../utils/example';
import { Input } from '..';
import Code from '.';

const Highlight = styled.span`
  color: ${props => props.theme.colors.blue400};
`;

export default class CodeExample extends React.Component {
  state = {
    value: '<ACCESS_KEY>',
  };

  onCopy = () => {
    console.log('Copied');
  };

  onChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  render() {
    return (
      <div>
        <Input placeholder="Dynamic content" onChange={this.onChange} />

        <Info>Long single line command</Info>
        <Example>
          <Code onCopy={this.onCopy}>
            kubectl create secret generic -n weave cloudwatch
            --from-literal=access-key-id=xyz
            --from-literal=secret-access-key=abc
          </Code>
        </Example>

        <Info>Multiline file</Info>
        <Example>
          <Code isFile onCopy={this.onCopy}>
            {`
{
  "AccessKey": {
    "AccessKeyId": "<YOUR_ACCESS_TOKEN>",
    "SecretAccessKey": "<YOUR_SECRET_ACCESS_KEY>"
  }
}
          `}
          </Code>
        </Example>

        <Info>Multiline single command</Info>
        <Example>
          <Code onCopy={this.onCopy}>
            {`
kubectl create secret generic -n weave cloudwatch \\
  --from-literal=access-key-id=xyz \\
  --from-literal=secret-access-key=abc
          `}
          </Code>
        </Example>

        <Info>Dynamic content in template string</Info>
        <Example>
          <Code isFile onCopy={this.onCopy}>
            {() =>
              trim(`
{
  "AccessKey": {
    "AccessKeyId": "${this.state.value}",
    "SecretAccessKey": "<YOUR_SECRET_ACCESS_KEY>"
  }
}
          `)
            }
          </Code>
        </Example>

        <Info>Dynamic content using template strings and JSX</Info>
        <Example>
          <Code onCopy={this.onCopy}>
            <span>
              {'kubectl create secret generic -n weave cloudwatch \\'}
              {'\n  '}
              <strong>--from-literal=access-key-id=</strong>
              <Highlight>{this.state.value}</Highlight>
              {' \\\n  '}
              {'--from-literal=secret-access-key='}
            </span>
          </Code>
        </Example>

        <Info>Dynamic content using HTML</Info>
        <Example>
          <Code onCopy={this.onCopy}>
            <div>
              kubectl create secret generic -n weave cloudwatch \<br />
              <span>
                <strong>{'  '}--from-literal=access-key-id=</strong>
                {this.state.value} \<br />
              </span>
              <span>{'  '}--from-literal=secret-access-key=</span>
            </div>
          </Code>
        </Example>

        <Info>Dynamic content using HTML</Info>
        <Example>
          <Code onCopy={this.onCopy}>
            <div>
              <div>{'{'}</div>
              <div>
                {'  '}&quot;AccessKey&quot;: {'{'}
              </div>
              <div>
                {'    '}
                <strong>&quot;AccessKeyId&quot;</strong>: &quot;{
                  this.state.value
                }&quot;,
              </div>
              <div>
                {'    '}
                <strong>&quot;SecretAccessKey&quot;</strong>:{' '}
                {'"<YOUR_SECRET_ACCESS_KEY>"'}
              </div>
              <div>
                {'  '}
                {'}'}
              </div>
              <div>{'}'}</div>
            </div>
          </Code>
        </Example>
      </div>
    );
  }
}
