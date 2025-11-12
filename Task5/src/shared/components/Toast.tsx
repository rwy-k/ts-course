import type { ToastProps } from '@/types';

export function Toast({ message, type, show, setShow }: ToastProps) {
    return (
    show && (
            <div className={`toast-container toast-${type}`}>
                <p>{message}</p>
                <button onClick={() => setShow(!show)}>Close</button>
            </div>
        )
    )
}