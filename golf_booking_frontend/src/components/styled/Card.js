import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Card = styled.div`
    padding: ${theme.spacing.lg};
    border-radius: ${theme.borderRadius.large};
    box-shadow: ${theme.shadows.small};
    transition: all 0.2s ease;
`; 