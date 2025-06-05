export const theme = {
    colors: {
        light: {
            primary: '#1a4d2e',     // Deep green
            secondary: '#9dc88d',   // Light sage green
            accent: '#c4a484',      // Warm brown
            background: '#f5f7f4',  // Light off-white with green tint
            cardBg: '#ffffff',      // Card background
            text: {
                dark: '#1a4d2e',    // Deep green for main text
                light: '#ffffff',   // White for contrast
                muted: '#6b8e4e'    // Muted green for secondary text
            }
        },
        dark: {
            primary: '#2d8049',     // Lighter green for dark mode
            secondary: '#557b4d',   // Darker sage green
            accent: '#ddb892',      // Lighter brown
            background: '#1a1a1a',  // Dark background
            cardBg: '#2d2d2d',      // Dark card background
            text: {
                dark: '#ffffff',    // White for main text
                light: '#ffffff',   // White for contrast
                muted: '#9dc88d'    // Light green for secondary text
            }
        }
    },
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px'
    },
    borderRadius: {
        small: '4px',
        medium: '8px',
        large: '12px'
    },
    shadows: {
        small: '0 2px 4px rgba(26, 77, 46, 0.1)',
        medium: '0 4px 6px rgba(26, 77, 46, 0.12)',
        large: '0 8px 16px rgba(26, 77, 46, 0.14)'
    },
    typography: {
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        sizes: {
            small: '0.875rem',
            body: '1rem',
            h3: '1.25rem',
            h2: '1.5rem',
            h1: '2rem'
        }
    }
}; 