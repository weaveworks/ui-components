import React from 'react';
import request from 'superagent';
import first from 'lodash/first';

import Text from '../src/components/Text';

export default class Intro extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      quote: null,
    };
  }
  componentDidMount() {
    request('https://quotes.rest/qod').end((err, { status, body }) => {
      if (status !== 429) {
        this.setState(() => ({
          quote: first(body.contents.quotes),
        }));
      }
    });
  }
  render() {
    return (
      <div>
        <p>
          <Text h2>Welcome to the Weave Cloud Style Guide™!</Text>
        </p>
        {this.state.quote && (
          <div>
            <p>
              <Text>{this.state.quote.quote}</Text>
            </p>
            <p>
              <Text italic>- {this.state.quote.author}</Text>
            </p>
          </div>
        )}
      </div>
    );
  }
}
