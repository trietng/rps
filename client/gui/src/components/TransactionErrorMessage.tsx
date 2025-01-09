import { Alert } from "@nextui-org/react";

interface TransactionErrorMessageProps {
    message: string;
    dismiss: () => void;
}

export function TransactionErrorMessage(props: TransactionErrorMessageProps) {
    return (
        <div className="w-1/3">     
            <Alert color="warning" title={props.message} onClose={props.dismiss}/>
        </div>
    );
}
