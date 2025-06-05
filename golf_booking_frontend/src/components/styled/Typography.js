import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Title = styled.h1`
    font-size: ${theme.typography.sizes.h1};
    font-family: ${theme.typography.fontFamily};
    margin-bottom: ${theme.spacing.md};
`;

export const Subtitle = styled.h2`
    font-size: ${theme.typography.sizes.h2};
    font-family: ${theme.typography.fontFamily};
    margin-bottom: ${theme.spacing.sm};
`;

export const Text = styled.p`
    font-size: ${theme.typography.sizes.body};
    font-family: ${theme.typography.fontFamily};
    line-height: 1.5;
`; 