import { createRoot } from 'react-dom/client';

let loadingContainer = null;
let loadingRoot = null;

const initLoadingContainer = () => {
    if (!loadingContainer) {
        loadingContainer = document.createElement('div');
        loadingContainer.id = 'loading-container';
        document.body.appendChild(loadingContainer);
        loadingRoot = createRoot(loadingContainer);
    }
};

const LoadingSpinner = ({ size = 'medium', color = 'var(--color-primary)' }) => {
    const sizes = {
        small: '20px',
        medium: '32px',
        large: '48px'
    };

    return (
        <div
            style={{
                width: sizes[size],
                height: sizes[size],
                border: `3px solid var(--color-border)`,
                borderTop: `3px solid ${color}`,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }}
        >
            <style>
                {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
            </style>
        </div>
    );
};

const FullScreenLoader = ({ message = 'Loading...' }) => (
    <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(245, 241, 235, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        animation: 'fadeIn 0.2s ease-out'
    }}>
        <style>
            {`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}
        </style>
        <LoadingSpinner size="large" />
        <div style={{
            marginTop: '16px',
            color: 'var(--color-text)',
            fontSize: '16px',
            fontWeight: '500'
        }}>
            {message}
        </div>
    </div>
);

let isLoading = false;

const showLoading = (message) => {
    if (isLoading) return;

    initLoadingContainer();
    isLoading = true;
    loadingRoot.render(<FullScreenLoader message={message} />);
};

const hideLoading = () => {
    if (!isLoading) return;

    isLoading = false;
    if (loadingRoot) {
        loadingRoot.render(null);
    }
};

export const loading = {
    show: showLoading,
    hide: hideLoading,
    Spinner: LoadingSpinner
};

export { LoadingSpinner };

export default loading;
