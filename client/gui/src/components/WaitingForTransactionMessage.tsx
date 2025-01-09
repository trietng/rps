import { Alert } from "@nextui-org/react";

interface WaitingForTransactionMessageProps {
    txHash: string;
}

export function WaitingForTransactionMessage(props: WaitingForTransactionMessageProps) {
    return (
        <div className="w-1/3">     
            <Alert color="warning">
                Waiting for transaction <strong>{props.txHash}</strong> to be mined...
            </Alert>
        </div>
    );
}
