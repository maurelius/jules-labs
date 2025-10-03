import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const PageWrapper = styled.div`
    min-height: calc(100vh - 60px); // Adjust based on your navbar height
    background-color: ${props => 
        props.theme.colors[props.isDark ? 'dark' : 'light'].background
    };
    color: ${props => 
        props.theme.colors[props.isDark ? 'dark' : 'light'].text.dark
    };
    transition: background-color 0.2s ease, color 0.2s ease;
    padding: ${theme.spacing.lg};
`; 