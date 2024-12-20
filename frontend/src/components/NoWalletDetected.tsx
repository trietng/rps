export function NoWalletDetected() {
    return (
        <div className="flex justify-center w-full">
            <p>
                No Ethereum wallet was detected. <br />
                Please install{" "}
                <a
                    href="https://www.coinbase.com/wallet"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Coinbase Wallet
                </a>
                {" "}
                <a href="http://metamask.io" target="_blank" rel="noopener noreferrer">
                    MetaMask
                </a>.
            </p>
        </div>
    );
}
