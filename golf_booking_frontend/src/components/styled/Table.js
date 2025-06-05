import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    background-color: ${props => props.theme.colors[props.isDark ? 'dark' : 'light'].cardBg};
    border-radius: ${theme.borderRadius.large};
    overflow: hidden;
`;

export const Th = styled.th`
    padding: ${theme.spacing.md};
    text-align: left;
    background-color: ${props => props.theme.colors[props.isDark ? 'dark' : 'light'].primary};
    color: ${props => props.theme.colors[props.isDark ? 'dark' : 'light'].text.light};
    font-weight: 600;
`;

export const Td = styled.td`
    padding: ${theme.spacing.md};
    border-bottom: 1px solid ${props => props.theme.colors[props.isDark ? 'dark' : 'light'].secondary};
    color: ${props => props.theme.colors[props.isDark ? 'dark' : 'light'].text.dark};
`;

export const Tr = styled.tr`
    &:hover {
        background-color: ${props => props.theme.colors[props.isDark ? 'dark' : 'light'].background};
    }
`; 