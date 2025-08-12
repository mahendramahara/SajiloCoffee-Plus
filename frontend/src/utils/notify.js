import { createRoot } from 'react-dom/client';

let notificationContainer = null;
let notificationRoot = null;

const initContainer = () => {
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      pointer-events: none;
    `;
        document.body.appendChild(notificationContainer);
        notificationRoot = createRoot(notificationContainer);
    }
};

const Notification = ({ type, title, message, onClose, id }) => {
    const typeStyles = {
        success: {
            bg: 'var(--color-success)',
            border: 'var(--color-success)',
            icon: '✓'
        },
        error: {
            bg: 'var(--color-danger)',
            border: 'var(--color-danger)',
            icon: '✕'
        },
        warning: {
            bg: 'var(--color-secondary)',
            border: 'var(--color-secondary)',
            icon: '⚠'
        },
        info: {
            bg: 'var(--color-accent)',
            border: 'var(--color-accent)',
            icon: 'ℹ'
        },
        auth: {
            bg: 'var(--color-primary)',
            border: 'var(--color-primary)',
            icon: '🔒'
        }
    };

    const style = typeStyles[type] || typeStyles.info;

    return (
        <div
            style={{
                background: 'var(--color-surface)',
                border: `2px solid ${style.border}`,
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '12px',
                minWidth: '320px',
                maxWidth: '480px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transform: 'translateX(400px)',
                animation: 'slideIn 0.3s ease-out forwards',
                pointerEvents: 'auto'
            }}
        >
            <style>
                {`
          @keyframes slideIn {
            to { transform: translateX(0); }
          }
          @keyframes slideOut {
            to { transform: translateX(400px); opacity: 0; }
          }
        `}
            </style>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div
                    style={{
                        background: style.bg,
                        color: 'white',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }}
                >
                    {style.icon}
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: 'var(--color-text)', marginBottom: '4px' }}>
                        {title}
                    </div>
                    <div style={{ color: 'var(--color-muted)', fontSize: '14px' }}>
                        {message}
                    </div>
                </div>
                <button
                    onClick={() => onClose(id)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-muted)',
                        fontSize: '18px',
                        lineHeight: 1,
                        padding: '0',
                        width: '20px',
                        height: '20px'
                    }}
                >
                    ×
                </button>
            </div>
        </div>
    );
};

const NotificationManager = ({ notifications }) => (
    <div>
        {notifications.map(notification => (
            <Notification key={notification.id} {...notification} />
        ))}
    </div>
);

let notifications = [];
let notificationId = 0;

const removeNotification = (id) => {
    notifications = notifications.filter(n => n.id !== id);
    render();
};

const render = () => {
    if (notificationRoot) {
        notificationRoot.render(
            <NotificationManager
                notifications={notifications.map(n => ({
                    ...n,
                    onClose: removeNotification
                }))}
            />
        );
    }
};

const addNotification = (type, title, message, duration = 5000) => {
    initContainer();

    const id = ++notificationId;
    const notification = { id, type, title, message };

    notifications.push(notification);
    render();

    if (duration > 0) {
        setTimeout(() => removeNotification(id), duration);
    }

    return id;
};

export const notify = {
    success: (title, message, duration) => addNotification('success', title, message, duration),
    error: (title, message, duration) => addNotification('error', title, message, duration),
    warning: (title, message, duration) => addNotification('warning', title, message, duration),
    info: (title, message, duration) => addNotification('info', title, message, duration),
    auth: (title, message, duration) => addNotification('auth', title, message, duration),
    remove: removeNotification,
    clear: () => {
        notifications = [];
        render();
    }
};

export const showAuthRequired = () => notify.auth(
    'Authentication Required',
    'Please log in to access this feature',
    4000
);

export const showUnauthorized = () => notify.error(
    'Access Denied',
    'You don\'t have permission to perform this action',
    4000
);

export const showSuccess = (message = 'Operation completed successfully') => notify.success(
    'Success',
    message,
    3000
);

export const showError = (message = 'Something went wrong') => notify.error(
    'Error',
    message,
    5000
);

export const showNotification = {
    success: (message = 'Operation completed successfully') => notify.success('Success', message, 3000),
    error: (message = 'Something went wrong') => notify.error('Error', message, 5000),
    warning: (message = 'Warning') => notify.warning('Warning', message, 4000),
    info: (message = 'Information') => notify.info('Info', message, 3000)
};

export default notify;
