import { Alert } from "@nextui-org/react";

interface NetworkErrorMessageProps {
    message: string;
    dismiss: () => void;
}

export function NetworkErrorMessage(props: NetworkErrorMessageProps) {
    return (
        <div className="w-1/3">     
            <Alert color="warning" title={props.message} onClose={props.dismiss}/>
        </div>
    );
}
