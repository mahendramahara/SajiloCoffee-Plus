export const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
};

export const spacing = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
};

export const shadows = {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
};

export const animations = {
    fadeIn: {
        animation: 'fadeIn 0.3s ease-out',
        '@keyframes fadeIn': {
            from: { opacity: 0 },
            to: { opacity: 1 }
        }
    },
    slideUp: {
        animation: 'slideUp 0.3s ease-out',
        '@keyframes slideUp': {
            from: { transform: 'translateY(20px)', opacity: 0 },
            to: { transform: 'translateY(0)', opacity: 1 }
        }
    },
    slideIn: {
        animation: 'slideIn 0.3s ease-out',
        '@keyframes slideIn': {
            from: { transform: 'translateX(100%)', opacity: 0 },
            to: { transform: 'translateX(0)', opacity: 1 }
        }
    }
};

export const flex = {
    center: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    between: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    start: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    end: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    col: {
        display: 'flex',
        flexDirection: 'column'
    },
    wrap: {
        display: 'flex',
        flexWrap: 'wrap'
    }
};

export const grid = {
    auto: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: spacing.md
    },
    two: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: spacing.md
    },
    three: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: spacing.md
    },
    four: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: spacing.md
    }
};

export const responsive = (styles) => {
    const mediaQueries = {};

    Object.keys(styles).forEach(key => {
        if (breakpoints[key]) {
            mediaQueries[`@media (min-width: ${breakpoints[key]})`] = styles[key];
        }
    });

    return {
        ...styles.base,
        ...mediaQueries
    };
};

export const utils = {
    truncate: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    srOnly: {
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0
    },
    resetButton: {
        background: 'none',
        border: 'none',
        padding: 0,
        margin: 0,
        font: 'inherit',
        cursor: 'pointer'
    },
    resetList: {
        listStyle: 'none',
        padding: 0,
        margin: 0
    }
};
