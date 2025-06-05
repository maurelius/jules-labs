import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.lg};
    max-width: 600px;
    margin: 0 auto;
`;

export const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.xs};
`;

export const Label = styled.label`
    color: ${props => props.theme.colors[props.isDark ? 'dark' : 'light'].text.muted};
    font-size: ${theme.typography.sizes.body};
    font-weight: 500;
`;

export const Input = styled.input`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border-radius: ${theme.borderRadius.medium};
    border: 1px solid ${props => props.theme.colors[props.isDark ? 'dark' : 'light'].secondary};
    background-color: ${props => props.theme.colors[props.isDark ? 'dark' : 'light'].cardBg};
    color: ${props => props.theme.colors[props.isDark ? 'dark' : 'light'].text.dark};
    font-size: ${theme.typography.sizes.body};
    
    &:focus {
        outline: none;
        border-color: ${props => props.theme.colors[props.isDark ? 'dark' : 'light'].primary};
        box-shadow: ${theme.shadows.small};
    }
`;

export const Select = styled.select`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border-radius: ${theme.borderRadius.medium};
    border: 1px solid ${props => props.theme.colors[props.isDark ? 'dark' : 'light'].secondary};
    background-color: ${props => props.theme.colors[props.isDark ? 'dark' : 'light'].cardBg};
    color: ${props => props.theme.colors[props.isDark ? 'dark' : 'light'].text.dark};
    font-size: ${theme.typography.sizes.body};
    
    &:focus {
        outline: none;
        border-color: ${props => props.theme.colors[props.isDark ? 'dark' : 'light'].primary};
        box-shadow: ${theme.shadows.small};
    }
`; 