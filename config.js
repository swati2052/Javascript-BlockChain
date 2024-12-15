// Define the initial difficulty
const MINE_RATE=1000;
const INITIAL_DIFFICULTY = 3;

// Define the genesis block data
const GENESIS_DATA = {
    timestamp: 1,
    prevHash: '0x000',
    hash:"0x123",
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0, // Changed to lowercase for consistency
    data: [],
};

module.exports = { GENESIS_DATA, MINE_RATE };
