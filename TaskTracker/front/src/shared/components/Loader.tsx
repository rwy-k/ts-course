import '../styles/loader.css';

export interface LoaderProps {
    loading?: boolean;
}

export function Loader({ loading = true }: LoaderProps) {
    return (
        <div className="loader">
            <div className="loader-spinner"></div>
            {loading && <p>Loading...</p>}
        </div>
    );
}
