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

const SwatchesBlock = styled.div`
  margin-top: 10px;
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
  padding: 12px 0;
  background-color: ${theme.colors.gallery};
`;

const curly = start => (start ? '{' : '}');

const maybeParseColor = v => {
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
    return '';
  }
  return `Diff from ${TEST_COLOR_NAME}: hsl(${round(
    ca.hue - cb.hue,
    2
  )}, ${round(ca.saturation - cb.saturation, 2)}, ${round(
    ca.lightness - cb.lightness,
    2
  )})`;
};

const colorDesc = x => {
  const cx = maybeParseColor(x);
  if (!cx) return '';

  return `hsl(${round(cx.hue, 2)}, ${round(cx.saturation, 2)}, ${round(
    cx.lightness,
    2
  )})`;
};

const swatches = (collection, testColor, matcher = /.*/) =>
  map(
    sortBy(toPairs(pickBy(collection, isString)), [
      ([, c]) => round(parseToHsl(c).hue, 2),
      ([, c]) => round(parseToHsl(c).saturation, 1),
      ([, c]) => round(parseToHsl(c).lightness, 2),
    ]),
    ([name, c]) =>
      name.match(matcher) ? (
        <Sample
          key={c}
          title={testColor ? diffColors(c, testColor) : colorDesc(c)}
        >
          <Swatch color={c} />
          <Label em={name === TEST_COLOR_NAME}>
            {isNaN(parseFloat(name)) && name}
          </Label>
        </Sample>
      ) : null
  );

class Colors extends React.Component {
  constructor(props) {
    super(props);

    this.state = { newColor: '' };
  }

  handleChange = ev => {
    this.setState({ newColor: ev.target.value });
  };

  renderSwatches(collection, matcher) {
    return (
      <SwatchesBlock>
        {swatches(
          {
            ...collection,
            ...(maybeParseColor(this.state.newColor) && {
              [TEST_COLOR_NAME]: this.state.newColor,
            }),
          },
          this.state.newColor,
          matcher
        )}
      </SwatchesBlock>
    );
  }

  render() {
    return (
      <div>
        <Row>
          <Text extraLarge>Colors</Text>
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
        <Text large bold>
          Primary Colors
        </Text>
        <Row>{this.renderSwatches(theme.colors, /^purple[0-9]+$/)}</Row>
        <Text large bold>
          Accent Colors
        </Text>
        <Row>{this.renderSwatches(theme.colors.accent)}</Row>
        <Text large bold>
          Status Colors
        </Text>
        <Row>{this.renderSwatches(theme.colors.status)}</Row>
        <Text large bold>
          Uncategorized Colors
        </Text>
        <Row>{this.renderSwatches(theme.colors, /^[^0-9]+$/)}</Row>
        <Text large bold>
          PromQL Colors
        </Text>
        <Row>{this.renderSwatches(theme.colors.promQL)}</Row>
        <Text large bold>
          PrometheusGraph Themes
        </Text>
        <div>
          <Text bold>Blue</Text>
          <Row>{this.renderSwatches(theme.colors.graphThemes.blue)}</Row>
          <Text bold>Purple</Text>
          <Row>{this.renderSwatches(theme.colors.graphThemes.purple)}</Row>
          <Text bold>Mixed</Text>
          <Row>{this.renderSwatches(theme.colors.graphThemes.mixed)}</Row>
        </div>
      </div>
    );
  }
}

export default Colors;
