import { useEffect, useState } from "react";

// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";

// Components
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, CircularProgress, useDisclosure, RadioGroup, getKeyValue, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { LuMountain, LuPlus, LuScissors, LuScroll, LuSend, LuUserRoundPlus, LuX } from "react-icons/lu";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import RockPaperScissorArtifact from "../contracts/rock-paper-scissor.json";
import contractAddress from "../contracts/contract-address.json";

// All the logic of this dapp is contained in the Dapp component.
// These other components are just presentational ones: they don't have any
// logic. They just render HTML.
import { NoWalletDetected } from "./NoWalletDetected";
import { ConnectWallet } from "./ConnectWallet";
import { TransactionErrorMessage } from "./TransactionErrorMessage";
import { WaitingForTransactionMessage } from "./WaitingForTransactionMessage";
import { HR } from "./ui/hr";
import { CustomRadio } from "./ui/custom/radio";
import { useMutation, useQuery } from "@tanstack/react-query";

declare global {
    interface Window {
        ethereum?: any;
    }
}

// This is the default id used by the Hardhat Network
const HARDHAT_NETWORK_ID = "1337";

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

// This component is in charge of doing these things:
//   1. It connects to the user's wallet
//   2. Initializes ethers and the Token contract
//   3. Polls the user balance to keep it updated.
//   4. Transfers tokens by sending transactions
//   5. Renders the whole application
//
// Note that (3) and (4) are specific of this sample application, but they show
// you how to keep your Dapp and contract's state in sync,  and how to send a
// transaction.

const attackStringValues = {
    "rock": "1",
    "paper": "2",
    "scissors": "3"
}

const columns = [
    { key: 'id', label: 'ID' },
    { key: 'player1', label: 'Player 1' },
    { key: 'player2', label: 'Player 2' },
    { key: 'winner', label: 'Winner' },
    // { key: 'status', label: 'Status' },
    { key: 'action', label: 'Action' }
]

type GameAction = "create" | "join";

export function Dapp() {
    const [tokenData, setTokenData] = useState<{ name: string; symbol: string }>();
    const [selectedAddress, setSelectedAddress] = useState<string>();
    const [txBeingSent, setTxBeingSent] = useState<any>();
    const [transactionError, setTransactionError] = useState<any>();
    const [networkError, setNetworkError] = useState<any>();
    const [token, setToken] = useState<ethers.Contract>();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [gameAction, setGameAction] = useState<GameAction>("create");
    const [selectedAttack, setSelectedAttack] = useState<number>(1);
    const [selectedGameId, setSelectedGameId] = useState<number>(0);
    const newGameMutation = useMutation({
        mutationFn: async () => await token?.newGame(selectedAttack),
        onSettled: async (data) => console.log(data)
    })
    const joinGameMutation = useMutation({
        mutationFn: async () => await token?.joinGame(selectedGameId, selectedAttack),
        onSettled: async (data) => console.log(data)
    })
    const games = useQuery({
        queryKey: ['games'],
        queryFn: async () => (await token?.getGames()) || [],
        select: (data: any[][]) => data[1].map(({ player1, player2, player1Attack, player2Attack, winner, status }, index) => {
            const id = data[0][index];
            return { id, player1, player2, player1Attack, player2Attack, winner, status }
        }),
        refetchInterval: 1000
    })

    useEffect(() => {
        console.log(games.data)
    }, [games.data]);

    function initialize(userAddress?: string) {
        // This method initializes the dapp
    
        // We first store the user's address in the component's state
        setSelectedAddress(userAddress);
    
        // Then, we initialize ethers, fetch the token's data, and start polling
        // for the user's balance.
    
        // Fetching the token data and the user's balance are specific to this
        // sample project, but you can reuse the same initialization pattern.
        initializeEthers();
    }

    function initializeEthers() {
        // We first initialize ethers by creating a provider using window.ethereum
        const provider = new ethers.providers.Web3Provider(window.ethereum);
    
        // Then, we initialize the contract using that provider and the token's
        // artifact. You can do this same thing with your contracts.
        const _token = new ethers.Contract(
            contractAddress.token,
            RockPaperScissorArtifact.abi,
            provider.getSigner(0)
        );
        setToken(_token);
    }

    async function getTokenData() {
        const name = await token?.name();
        const symbol = await token?.symbol();
        const tokenData = { name, symbol };
        setTokenData(tokenData);
    }

    // This method resets the state
    function resetState() {
        setTokenData(undefined);
        setSelectedAddress(undefined);
        setTxBeingSent(undefined);
        setTransactionError(undefined);
        setNetworkError(undefined);
    }

    async function switchChain() {
        const chainIdHex = `0x${HARDHAT_NETWORK_ID}`;
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainIdHex }],
        });
        initialize(selectedAddress);
    }

    // This method checks if the selected network is Localhost:8545
    function checkNetwork() {
        if (window.ethereum.networkVersion !== HARDHAT_NETWORK_ID) {
            switchChain();
        }
    }

      // This method just clears part of the state.
    function dismissTransactionError() {
        setTransactionError(undefined);
    }

    // This method just clears part of the state.
    function dismissNetworkError() {
        setNetworkError(undefined);
    }

    // This is an utility method that turns an RPC error into a human readable message.
    function getRpcErrorMessage(error: any) {
        if (error.data) {
            return error.data.message;
        }
        return error.message;
    }


    async function connectWallet() {
        // This method is run when the user clicks the Connect. It connects the
        // dapp to the user's wallet, and initializes it.

        // To connect to the user's wallet, we have to run this method.
        // It returns a promise that will resolve to the user's address.
        const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Once we have the address, we can initialize the application.

        // First we check the network
        checkNetwork();
        initialize(selectedAddress);

        // We reinitialize it whenever the user changes their account.
        window.ethereum.on("accountsChanged", async ([newAddress]: string | undefined[]) => {
            // `accountsChanged` event can be triggered with an undefined newAddress.
            // This happens when the user removes the Dapp from the "Connected
            // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
            // To avoid errors, we reset the dapp state 
            if (newAddress === undefined) {
                return resetState();
            }
            
            initialize(newAddress);
        });
    }

    // This method sends an ethereum transaction to transfer tokens.
    // While this action is specific to this application, it illustrates how to
    // send a transaction.
    async function transferTokens(to: any, amount: any) {
        // Sending a transaction is a complex operation:
        //   - The user can reject it
        //   - It can fail before reaching the ethereum network (i.e. if the user
        //     doesn't have ETH for paying for the tx's gas)
        //   - It has to be mined, so it isn't immediately confirmed.
        //     Note that some testing networks, like Hardhat Network, do mine
        //     transactions immediately, but your dapp should be prepared for
        //     other networks.
        //   - It can fail once mined.
        //
        // This method handles all of those things, so keep reading to learn how to
        // do it.

        try {
            // If a transaction fails, we save that error in the component's state.
            // We only save one such error, so before sending a second transaction, we
            // clear it.
            dismissTransactionError();

            // We send the transaction, and save its hash in the Dapp's state. This
            // way we can indicate that we are waiting for it to be mined.
            const tx = await token?.transfer(to, amount);
            setTxBeingSent(tx.hash);

            // We use .wait() to wait for the transaction to be mined. This method
            // returns the transaction's receipt.
            const receipt = await tx.wait();

            // The receipt, contains a status flag, which is 0 to indicate an error.
            if (receipt.status === 0) {
                // We can't know the exact error that made the transaction fail when it
                // was mined, so we throw this generic one.
                throw new Error("Transaction failed");
            }

            // If we got here, the transaction was successful, so you may want to
            // update your state. Here, we update the user's balance.
            // await updateBalance();
        } catch (error: any) {
            // We check the error code to see if this error was produced because the
            // user rejected a tx. If that's the case, we do nothing.
            if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
                return;
            }

            // Other errors are logged and stored in the Dapp's state. This is used to
            // show them to the user, and for debugging.
            console.error(error);
            setTransactionError(error);
        } finally {
            // If we leave the try/catch, we aren't sending a tx anymore, so we clear
            // this part of the state.
            setTxBeingSent(undefined);
        }
    } 

    function onSubmitNewGame(action: GameAction) {
        if (action === "create") {
            newGameMutation.mutate();
        } else {
            joinGameMutation.mutate();
        }
        onOpenChange();
    }

    function onCommitGameAction(action: GameAction) {
        setGameAction(action);
        onOpen();
    }

    useEffect(() => {
        if (token) {
            getTokenData();
            // updateBalance();
        }
    }, [token]);

    // Ethereum wallets inject the window.ethereum object. If it hasn't been
    // injected, we instruct the user to install a wallet.
    if (window.ethereum === undefined) {
        return <NoWalletDetected />;
    }

    // The next thing we need to do, is to ask the user to connect their wallet.
    // When the wallet gets connected, we are going to save the users's address
    // in the component's state. So, if it hasn't been saved yet, we have
    // to show the ConnectWallet component.
    //
    // Note that we pass it a callback that is going to be called when the user
    // clicks a button. This callback just calls the _connectWallet method.
    if (!selectedAddress) {
        return (
            <ConnectWallet 
                connectWallet={() => connectWallet()}
                networkError={networkError}
                dismiss={() => dismissNetworkError()}
            />
        );
    }

    // If the token data or the user's balance hasn't loaded yet, we show
    // a loading component.
    if (!tokenData) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center">
                <CircularProgress aria-label="Loading..." size="lg"/>
            </div>
        );
    }

    // If everything is loaded, we render the application.
    return (
        <div className="flex flex-col p-4">
            <div>
                <div className="text-2xl">
                    {tokenData.name} ({tokenData.symbol})
                </div>
                <p>
                Welcome {selectedAddress}.
                </p>
            </div>
            <HR />
            <div>
                {/* 
                Sending a transaction isn't an immediate action. You have to wait
                for it to be mined.
                If we are waiting for one, we show a message here.
                */}
                {txBeingSent && (
                    <WaitingForTransactionMessage txHash={txBeingSent} />
                )}

                {/* 
                Sending a transaction can fail in multiple ways. 
                If that happened, we show a message here.
                */}
                {transactionError && (
                    <TransactionErrorMessage
                        message={getRpcErrorMessage(transactionError)}
                        dismiss={() => dismissTransactionError()}
                    />
                )}
            </div>
            <div>
                <Button onPress={() => onCommitGameAction("create")}><LuPlus/> New Game</Button>
                <Modal isOpen={isOpen} onClose={onOpenChange} size="lg">
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">{gameAction === "create" ? "Create New Game" : "Join Game"}</ModalHeader>
                                <ModalBody>
                                <RadioGroup label="Attack" orientation="horizontal" onValueChange={(value) => setSelectedAttack(Number(value))} defaultValue={attackStringValues.rock}>
                                    <CustomRadio value={attackStringValues.rock}>
                                        <LuMountain className="inline"/> Rock
                                    </CustomRadio>
                                    <CustomRadio value={attackStringValues.paper}>
                                        <LuScroll className="inline"/> Paper
                                    </CustomRadio>
                                    <CustomRadio value={attackStringValues.scissors}>
                                        <LuScissors className="inline"/> Scissors
                                    </CustomRadio>
                                </RadioGroup>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        <LuX className="inline"/> Close
                                    </Button>
                                    <Button color="primary" onPress={() => onSubmitNewGame(gameAction)}>
                                        <LuSend className="inline"/> Submit
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
                <Table aria-label="Table of all games" className="mt-4">
                    <TableHeader columns={columns}>
                        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                    </TableHeader>
                    <TableBody items={games.data || []}>
                        {(item: any) => (
                            <TableRow key={item.id.toNumber()}>
                                {(columnKey) => {
                                    if (columnKey === 'id') {
                                        return (
                                            <TableCell key={columnKey}>{item.id.toNumber()}</TableCell>
                                        );
                                    } else if (columnKey === 'action') {
                                        return (
                                            <TableCell key={columnKey}>
                                                {item.status === true || item.player1.toString().toLowerCase() === selectedAddress.toLowerCase() ?
                                                "N/A" :
                                                <Button 
                                                    color="primary"
                                                    onPress={() => {
                                                        setSelectedGameId(item.id.toNumber());
                                                        onCommitGameAction("join")
                                                    }}
                                                ><LuUserRoundPlus className="inline"/> Join</Button>}
                                            </TableCell>
                                        );
                                    }
                                    const value = getKeyValue(item, columnKey);
                                    if (Number(value) === 0) {
                                        return (<TableCell key={columnKey}>N/A</TableCell>);
                                    }
                                    return (<TableCell key={columnKey}>{value.toString()}</TableCell>);
                                }}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
