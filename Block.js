// Import GENESIS_DATA from config
const { GENESIS_DATA } = require("./config");
const cryptoHash = require("./crypto-hash");
const hexToBinary=require("hex-to-binary");
class Block {
    constructor({ timestamp, prevHash, hash, nonce, difficulty, data }) {
        this.timestamp = timestamp;
        this.prevHash = prevHash;
        this.hash = hash;
        this.nonce = nonce;
        this.difficulty = difficulty;
        this.data = data;
    }

    // Static method to create the genesis block
    static genesis() {
        return new this(GENESIS_DATA);
    }

    // Static method to mine a new block
    static mineBlock({ prevBlock, data }) {
        let hash, timestamp;
        const prevHash = prevBlock.hash;
        let { difficulty } = prevBlock; // Carry forward the previous block's difficulty
        let nonce = 0;

        // Proof-of-Work: Adjust nonce until the hash satisfies difficulty criteria
        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({ originalBlock: prevBlock, timestamp });
            hash = cryptoHash(timestamp, prevHash, data, nonce, difficulty);
        } while (hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty));

        return new this({
            timestamp,
            prevHash,
            data,
            difficulty,
            nonce,
            hash,
        });
    }

    // Static method to adjust the difficulty
    static adjustDifficulty({ originalBlock, timestamp }) {
        const { difficulty } = originalBlock;
        if (difficulty < 1) return 1; // Ensure difficulty does not go below 1

        const difference = timestamp - originalBlock.timestamp;

        // Adjust difficulty based on MINE_RATE
        const MINE_RATE = 3000; // You can adjust the mining rate in milliseconds
        if (difference > MINE_RATE) return difficulty - 1;
        return difficulty + 1;
    }
}

// Example usage: Creating a new block
const block1 = new Block({
    hash: "0xacb",
    timestamp: "2/09/22",
    prevHash: "0xc12",
    data: "hello",
    nonce: 0,
    difficulty: 1,
});

// Export the Block class for reuse
module.exports = Block;
