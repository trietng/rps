interface NetworkErrorMessageProps {
    message: string;
    dismiss: () => void;
}

export function NetworkErrorMessage(props: NetworkErrorMessageProps) {
    return (
        <div className="alert alert-danger" role="alert">
            {props.message}
            <button
                type="button"
                className="close"
                data-dismiss="alert"
                aria-label="Close"
                onClick={props.dismiss}
            >
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    );
}
