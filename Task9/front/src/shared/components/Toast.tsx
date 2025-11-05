import '../styles/toast.css';
import type { ToastProps } from '../types';

export function Toast({ message, type, show }: ToastProps) {
    return (
        show && (
            <div className={`toast-container toast-${type}`}>
                <p>{message}</p>
            </div>
        )
    );
}