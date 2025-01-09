interface NoTokensMessageProps {
    selectedAddress: string;
}

export function NoTokensMessage(props: NoTokensMessageProps) {
    return (
        <>
            <p>You don't have tokens to transfer</p>
            <p>
                To get some tokens, open a terminal in the root of the repository and run: 
                <br />
                <br />
                <code>npx hardhat --network localhost faucet {props.selectedAddress}</code>
            </p>
        </>
    );
}
