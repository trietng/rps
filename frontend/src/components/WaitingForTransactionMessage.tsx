interface WaitingForTransactionMessageProps {
    txHash: string;
}

export function WaitingForTransactionMessage(props: WaitingForTransactionMessageProps) {
    return (
        <div className="alert alert-info" role="alert">
            Waiting for transaction <strong>{props.txHash}</strong> to be mined
        </div>
    );
}
