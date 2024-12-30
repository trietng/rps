import asyncio
from blockchain_listener import BlockchainListener


URL = 'http://localhost:8545'

if __name__ == '__main__':
    listener = BlockchainListener(URL, './backend/contracts')
    loop = asyncio.new_event_loop()
    loop.run_until_complete(listener.listen())
