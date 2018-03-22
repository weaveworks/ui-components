import React from 'react';
import styled from 'styled-components';
import { map, pickBy, isString, sortBy, toPairs, round } from 'lodash';
import { parseToHsl } from 'polished';

import Text from '../src/components/Text';
import theme from '../src/theme';

const TEST_COLOR_NAME = 'A new color';

const Row = styled.div`
  margin-bottom: 40px;
`;

const Sample = styled.div`
  display: inline-block;
  margin-right: 20px;
`;

const Swatch = styled.div`
  width: 110px;
  height: 110px;
  border-radius: ${props => props.theme.borderRadius};
  background-color: ${props => props.color};
`;

const Label = styled.p`
  text-align: center;
  line-height: 1em;
  ${({ em }) => em && 'font-style: italic;'};
`;

const NewColorFormRow = Row.extend`
  position: sticky;
  top: 0;
  padding: 12px;
  background-color: ${theme.colors.sand};
`;

const curly = start => (start ? '{' : '}');

const maybeParseColor = (v) => {
  try {
    return parseToHsl(v);
  } catch (e) {
    return undefined;
  }
};

const diffColors = (a, b) => {
  const ca = maybeParseColor(a);
  const cb = maybeParseColor(b);
  if (!ca || !cb) {
    return undefined;
  }
  return `Diff from ${TEST_COLOR_NAME}: hsl(${round(
    ca.hue - cb.hue,
    2
  )}, ${round(ca.saturation - cb.saturation, 2)}, ${round(
    ca.lightness - cb.lightness,
    2
  )})`;
};

const swatches = (collection, testColor) =>
  map(
    sortBy(toPairs(pickBy(collection, isString)), [
      ([, c]) => parseToHsl(c).hue,
      ([, c]) => parseToHsl(c).saturation,
      ([, c]) => parseToHsl(c).lightness,
    ]),
    ([name, c]) => (
      <Sample key={c} title={testColor && diffColors(c, testColor)}>
        <Swatch color={c} />
        <Label em={name === TEST_COLOR_NAME}>{name}</Label>
      </Sample>
    )
  );

class Colors extends React.Component {
  constructor() {
    super();
    this.state = { newColor: '' };
  }

  handleChange = (ev) => {
    this.setState({ newColor: ev.target.value });
  };

  renderSwatches(collection) {
    return swatches(
      {
        ...collection,
        ...(maybeParseColor(this.state.newColor) && {
          [TEST_COLOR_NAME]: this.state.newColor,
        }),
      },
      this.state.newColor
    );
  }

  render() {
    return (
      <div>
        <Row>
          <p>These colors can be accessed via the styled-components theme:</p>
        </Row>
        <Row>
          <pre>
            const MyButton = styled.button`
            <br />
            &nbsp; background: ${curly(true)}props =&gt;
            props.theme.colors.accent.blue{curly(false)};
            <br />
            `;
          </pre>
        </Row>
        <NewColorFormRow>
          Test out <em>{TEST_COLOR_NAME}</em>, maybe we{"'"}ve something similar
          for you:{' '}
          <input
            type="text"
            placeholder="e.g. #029cd7"
            value={this.state.newColor}
            onChange={this.handleChange}
          />
        </NewColorFormRow>
        <Text large>Primary Colors</Text>
        <Row>{this.renderSwatches(theme.colors.primary)}</Row>
        <Text large>Accent Colors</Text>
        <Row>{this.renderSwatches(theme.colors.accent)}</Row>
        <Text large>Status Colors</Text>
        <Row>{this.renderSwatches(theme.colors.status)}</Row>
        <Text large>Neutral Colors</Text>
        <Row>{this.renderSwatches(theme.colors.neutral)}</Row>
        <Text large>Legacy Colors</Text>
        <Row>{this.renderSwatches(theme.colors)}</Row>
        <Text large>PromQL Colors</Text>
        <Row>{this.renderSwatches(theme.colors.promQL)}</Row>
      </div>
    );
  }
}

export default Colors;
