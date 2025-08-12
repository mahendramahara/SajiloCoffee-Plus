import { createRoot } from 'react-dom/client';

let modalContainer = null;
let modalRoot = null;

const initModalContainer = () => {
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'modal-container';
        document.body.appendChild(modalContainer);
        modalRoot = createRoot(modalContainer);
    }
};

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'medium',
    showCloseButton = true,
    closeOnOverlay = true
}) => {
    if (!isOpen) return null;

    const sizes = {
        small: '400px',
        medium: '500px',
        large: '700px',
        full: '90vw'
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
                padding: '20px',
                animation: 'fadeIn 0.2s ease-out'
            }}
            onClick={closeOnOverlay ? onClose : undefined}
        >
            <style>
                {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
            </style>
            <div
                style={{
                    background: 'var(--color-surface)',
                    borderRadius: '12px',
                    width: '100%',
                    maxWidth: sizes[size],
                    maxHeight: '90vh',
                    overflow: 'hidden',
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                    animation: 'slideUp 0.2s ease-out'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {title && (
                    <div style={{
                        padding: '20px 24px',
                        borderBottom: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <h2 style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            color: 'var(--color-text)',
                            margin: 0
                        }}>
                            {title}
                        </h2>
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    color: 'var(--color-muted)',
                                    cursor: 'pointer',
                                    padding: '0',
                                    width: '24px',
                                    height: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                ×
                            </button>
                        )}
                    </div>
                )}
                <div style={{
                    padding: title ? '24px' : '32px',
                    maxHeight: title ? 'calc(90vh - 80px)' : 'calc(90vh - 64px)',
                    overflow: 'auto'
                }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

const showModal = (config) => {
    initModalContainer();

    const modalConfig = {
        isOpen: true,
        onClose: () => hideModal(),
        ...config
    };

    modalRoot.render(<Modal {...modalConfig} />);
};

const hideModal = () => {
    if (modalRoot) {
        modalRoot.render(null);
    }
};

export const popup = {
    show: showModal,
    hide: hideModal,

    confirm: (title, message, onConfirm, onCancel) => {
        showModal({
            title,
            size: 'small',
            closeOnOverlay: false,
            showCloseButton: false,
            children: (
                <div>
                    <p style={{
                        color: 'var(--color-text)',
                        marginBottom: '24px',
                        lineHeight: 1.5
                    }}>
                        {message}
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        justifyContent: 'flex-end'
                    }}>
                        <button
                            onClick={() => {
                                hideModal();
                                onCancel?.();
                            }}
                            style={{
                                background: 'var(--color-border)',
                                color: 'var(--color-text)',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                hideModal();
                                onConfirm?.();
                            }}
                            style={{
                                background: 'var(--color-primary)',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )
        });
    },

    alert: (title, message, onOk) => {
        showModal({
            title,
            size: 'small',
            closeOnOverlay: false,
            showCloseButton: false,
            children: (
                <div>
                    <p style={{
                        color: 'var(--color-text)',
                        marginBottom: '24px',
                        lineHeight: 1.5
                    }}>
                        {message}
                    </p>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end'
                    }}>
                        <button
                            onClick={() => {
                                hideModal();
                                onOk?.();
                            }}
                            style={{
                                background: 'var(--color-primary)',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )
        });
    }
};

export default popup;
