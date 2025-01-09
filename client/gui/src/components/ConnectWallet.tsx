
import { Button } from "@nextui-org/react";
import { NetworkErrorMessage } from "./NetworkErrorMessage";

interface ConnectWalletProps {
    connectWallet: () => void;
    networkError: string;
    dismiss: () => void;
}

export function ConnectWallet(props: ConnectWalletProps) {
    return (
        <div className="flex flex-col justify-center mt-4">
            <div className="flex justify-center">
                {/* Wallet network should be set to Localhost:8545. */}
                {props.networkError && (
                    <NetworkErrorMessage 
                        message={props.networkError} 
                        dismiss={props.dismiss} 
                    />
                )}
            </div>
            <div className="p-4 text-center">
                <p className="mb-2">Please connect to your wallet.</p>
                <Button
                    color="primary"
                    type="button"
                    onPress={props.connectWallet}
                >
                    Connect Wallet
                </Button>
            </div>
        </div>
    );
}
