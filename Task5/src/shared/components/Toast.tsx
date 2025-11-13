import { ToastType } from '@/types';
interface ToastProps {
    message: string;
    type: ToastType;
    show: boolean;
    setShow: (show: boolean) => void;
}

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