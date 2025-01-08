import { Link } from "@nextui-org/react";

export function NoWalletDetected() {
    return (
        <div className="min-h-screen  flex flex-col justify-center items-center ">
            <p>
                No Ethereum wallet was detected.
            </p>
            <p>
                Please install{" "}
                <Link
                    href="https://www.coinbase.com/wallet"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Coinbase Wallet
                </Link> or {" "}
                <Link href="http://metamask.io" target="_blank" rel="noopener noreferrer">
                    MetaMask
                </Link>.
            </p>
        </div>
    );
}
