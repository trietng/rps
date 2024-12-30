import asyncio
from web3 import AsyncWeb3, AsyncHTTPProvider
import json

class BlockchainListener:
    def __init__(self, url: str, contracts_path: str):
        self.w3 = AsyncWeb3(AsyncHTTPProvider(url))
        with open(f'{contracts_path}/contract-address.json') as ca:
            contract_address = json.load(ca)
            with open(f'{contracts_path}//rock-paper-scissor.json') as rps:
                rock_paper_scissor = json.load(rps)
                self.contract = self.w3.eth.contract(
                    address=contract_address['token'],
                    abi=rock_paper_scissor['abi']
                )

    async def listen(self):
        filter = await self.contract.events.GameReady().create_filter(from_block='latest')
        while True:
            for event in await filter.get_new_entries():
                print(event)
            await asyncio.sleep(0)
            
