import { logger } from '@/lib/logger';
import { useToast } from '@/hooks/use-toast';

export function useSafeToast() {
  try {
    const result = useToast();
    return result;
  } catch (error) {
    logger.warn('useSafeToast: Toast hook not available, using fallback:', error);
    return {
      toast: ({ title, description, variant }: { title?: string; description?: string; variant?: string }) => {
        if (typeof window !== 'undefined') {
          const notification = document.createElement('div');
          notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #1a1a1a;
            color: white;
            padding: 16px;
            border-radius: 8px;
            border: 1px solid #333;
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
          `;
          
          const titleDiv = document.createElement('div');
          titleDiv.style.cssText = 'font-weight: 600; margin-bottom: 4px;';
          titleDiv.textContent = title || 'Notification';
          
          const descDiv = document.createElement('div');
          descDiv.style.cssText = 'font-size: 14px; opacity: 0.9;';
          descDiv.textContent = description || '';
          
          notification.appendChild(titleDiv);
          notification.appendChild(descDiv);
          document.body.appendChild(notification);
          
          setTimeout(() => {
            if (notification.parentNode) {
              notification.parentNode.removeChild(notification);
            }
          }, 5000);
        }
      },
      dismiss: () => {
        // Fallback dismiss - no-op
      },
      toasts: []
    };
  }
}
