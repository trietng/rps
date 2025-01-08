import asyncio
from web3 import AsyncWeb3, AsyncHTTPProvider, Web3
import json
import os


class BlockchainListener:
    def __init__(self, url: str, contracts_path: str, message_queue: asyncio.Queue):
        self.mq = message_queue
        self.w3 = AsyncWeb3(AsyncHTTPProvider(url))
        with open(f'{contracts_path}/contract-address.json') as ca:
            contract_address = json.load(ca)
            with open(f'{contracts_path}//rock-paper-scissor.json') as rps:
                rock_paper_scissor = json.load(rps)
                self.contract = self.w3.eth.contract(
                    address=contract_address['token'],
                    abi=rock_paper_scissor['abi']
                )
    
    async def handle_event(self, event):
        # Parse and handle the GameReady event
        args = event["args"]
        game_id = args["gameId"]
        player1 = args["player1"]
        player2 = args["player2"]
        player1_attack = args["player1Attack"]
        player2_attack = args["player2Attack"]

        print(f"Game Ready Event Detected:")
        print(f"  Game ID: {game_id}")
        print(f"  Player 1: {player1} (Attack: {player1_attack})")
        print(f"  Player 2: {player2} (Attack: {player2_attack})")

        # Additional logic (e.g., logging or triggering other systems)
        print("Processing game data...")

        await self.run_mpc(player1_attack, player2_attack, player1, player2, game_id)

    async def run_mpc(self, player1_attack, player2_attack, player1, player2, game_id):
        os.chdir("./mp-spdz")
        print("Changing directory to: ", os.getcwd())

        # Write inputs for MPC computation
        p0_path = "Player-Data/Input-P0-0"
        p1_path = "Player-Data/Input-P1-0"

        with open(p0_path, "w") as p0_file:
            p0_file.write(str(player1_attack))
            p0_file.flush()
        print("Player 0 input written to: ", os.path.abspath(p0_path))

        with open(p1_path, "w") as p1_file:
            p1_file.write(str(player2_attack))
            p1_file.flush()
        print("Player 1 input written to: ", os.path.abspath(p1_path))


        print("Starting MPC computation...")
        # Run Party 0
        process_p0 = await asyncio.create_subprocess_exec(
            "./spdz2k-party.x", "-p", "0", "--batch-size", "64", "rps_demo",
            # stdin=asyncio.subprocess.PIPE,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )

        # Write input to Party 1's stdin
        # process_p1.stdin.write(f"{player2_attack}\n".encode())
        # await process_p1.stdin.drain()
        # process_p1.stdin.close()

        # Run Party 1
        process_p1 = await asyncio.create_subprocess_exec(
            "./spdz2k-party.x", "-p", "1", "--batch-size", "64", "rps_demo",
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )

        stdout_p0, stderr_p0 = await process_p0.communicate()
        print(f"[Party 0 Output]:\n{stdout_p0.decode()}")

        print("MPC computation finished.")
        # Send result to the blockchain
        print("Submitting result to blockchain...")
        winner_code = int(stdout_p0.decode().strip())
        if winner_code == 1:
            winner = player1
        elif winner_code == 2:
            winner = player2
        else:
            winner = "0x0"

        print(f"Winner: {type(game_id)}")
        

        
        txn = await self.contract.functions.submitResult(game_id, (winner)).transact()
        print(f"Transaction hash: {txn}")
        os.chdir(".. ")



    async def listen(self):
        filter = await self.contract.events.GameReady().create_filter(from_block='latest')
        print("Listening for GameJoined events...")
        while True:
            for event in await filter.get_new_entries():
                # self.mq.put_nowait(event['args'])
                await self.handle_event(event)
            await asyncio.sleep(0)
            
