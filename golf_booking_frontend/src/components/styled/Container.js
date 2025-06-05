import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: ${theme.spacing.lg};
    min-height: 100vh;
`;

export const FlexContainer = styled.div`
    display: flex;
    gap: ${props => theme.spacing[props.gap || 'md']};
    align-items: ${props => props.alignItems || 'center'};
    justify-content: ${props => props.justifyContent || 'flex-start'};
    flex-direction: ${props => props.direction || 'row'};
`;

export const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(${props => props.minWidth || '300px'}, 1fr));
    gap: ${props => theme.spacing[props.gap || 'lg']};
`; 