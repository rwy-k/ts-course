import '../styles/loader.css';

export function Loader({ loading = true }: { loading?: boolean }) {
    return (
        <div className="loader">
            <div className="loader-spinner"></div>
            {loading && <p>Loading...</p>}
        </div>
    );
}
