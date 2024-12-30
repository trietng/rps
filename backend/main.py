import asyncio
from blockchain_listener import BlockchainListener

async def main():
    mq = asyncio.Queue()
    listener = BlockchainListener('http://localhost:8545', './backend/contracts', mq)
    await listener.listen()

if __name__ == '__main__':
    asyncio.run(main())
