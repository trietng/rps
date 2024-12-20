import { Alert } from "@nextui-org/react";

interface NetworkErrorMessageProps {
    message: string;
    dismiss: () => void;
}

export function NetworkErrorMessage(props: NetworkErrorMessageProps) {
    return (
        <Alert color="warning" title={props.message} onClose={props.dismiss}/>
    );
}
