import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Button = styled.button`
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
    border-radius: ${theme.borderRadius.medium};
    font-size: ${theme.typography.sizes.body};
    font-family: ${theme.typography.fontFamily};
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    color: ${theme.colors.light.text.light};
    
    &:hover {
        transform: translateY(-1px);
        box-shadow: ${theme.shadows.medium};
    }
    
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`; 