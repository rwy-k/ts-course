export function Toast({ message, type, show, setShow }: { message: string, type: 'success' | 'error', show: boolean, setShow: (show: boolean) => void }) {
    return (
    show && (
            <div className={`toast-container toast-${type}`}>
                <p>{message}</p>
                <button onClick={() => setShow(!show)}>Close</button>
            </div>
        )
    )
}