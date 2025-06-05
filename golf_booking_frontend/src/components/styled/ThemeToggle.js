import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const ThemeToggle = styled.button`
    position: fixed;
    top: 20px;
    right: 20px;
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border-radius: ${theme.borderRadius.medium};
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 1000;
    border: 1px solid currentColor;
`; 