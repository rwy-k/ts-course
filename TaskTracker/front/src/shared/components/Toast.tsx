import '../styles/toast.css';
import type { ToastType } from '../types';

export interface ToastProps {
    message: string;
    type: ToastType;
    show: boolean;
}

export function Toast({ message, type, show }: ToastProps) {
    return (
        show && (
            <div className={`toast-container toast-${type}`}>
                <p>{message}</p>
            </div>
        )
    );
}
