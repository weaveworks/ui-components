import styled from 'styled-components';
import { spacing } from '../theme/selectors';

export const Example = styled.div`
  margin-bottom: ${spacing('large')};
`;

export const Info = styled.h4`
  color: ${props => props.theme.colors.gray600};
  font-size: ${props => props.theme.fontSizes.normal};
  margin-bottom: ${spacing('small')};
`;
