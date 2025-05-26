import toast from 'react-hot-toast';

export const useToastMessage = () => {
  const baseStyle = {
    background: '#121212', 
    color: '#FFFFFF', 
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    fontSize: '14px',
  };

  const success = (message: string) => {
    toast.success(message, {
      duration: 3000,
      position: 'bottom-right',
      style: {
        ...baseStyle,
        border: '1px solid #0D9488', 
      },
    });
  };

  const error = (message: string) => {
    toast.error(message, {
      duration: 4000,
      position: 'bottom-right',
      style: {
        ...baseStyle,
        border: '1px solid #EF4444',
      },
    });
  };

  const warning = (message: string) => {
    toast(message, {
      duration: 3000,
      position: 'bottom-right',
      icon: '⚠️',
      style: {
        ...baseStyle,
        border: '1px solid #F59E0B', 
      },
    });
  };

  const info = (message: string) => {
    toast(message, {
      duration: 3000,
      position: 'bottom-right',
      icon: 'ℹ️',
      style: {
        ...baseStyle,
        border: '1px solid #3B82F6',
      },
    });
  };

  const showToast = (
    message: string,
    options?: {
      type?: 'success' | 'error' | 'warning' | 'info';
      duration?: number;
      position?:
        | 'top-left'
        | 'top-center'
        | 'top-right'
        | 'bottom-left'
        | 'bottom-center'
        | 'bottom-right';
    }
  ) => {
    const {
      type = 'default',
      duration = 3000,
      position = 'bottom-right',
    } = options || {};

    switch (type) {
      case 'success':
        success(message);
        break;
      case 'error':
        error(message);
        break;
      case 'warning':
        warning(message);
        break;
      case 'info':
        info(message);
        break;
      default:
        toast(message, {
          duration,
          position,
          style: {
            ...baseStyle,
            border: '1px solid #6B7280', 
          },
        });
    }
  };

  return {
    showToast,
    success,
    error,
    warning,
    info,
  };
};
