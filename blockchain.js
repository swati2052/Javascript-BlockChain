const cryptoHash = require('./crypto-hash');
const Block = require('./Block');

class Blockchain {
    constructor() {
        // Initialize the chain with the genesis block
        this.chain = [Block.genesis()];
    }

    // Method to add a new block to the chain
    addBlock(data) {
        const previousBlock = this.chain[this.chain.length - 1]; // Get the last block in the chain

        const newBlock = {
            index: previousBlock.index + 1,
            timestamp: Date.now(),
            data: data,
            previousHash: previousBlock.hash,
            hash: this.calculateHash(previousBlock.index + 1, data, previousBlock.hash),
        };

        this.chain.push(newBlock); // Add the new block to the chain
        return newBlock; // Return the new block after adding it
    }

    // Method to calculate hash for the new block
    calculateHash(index, data, previousHash) {
        return cryptoHash(index, data, previousHash);
    }

    // Method to replace the current chain with a new one if valid and longer
    replaceChain(chain) {
        console.log(this.chain);
        console.log(chain);
        if (chain.length <= this.chain.length) {
            console.error("The incoming chain is not longer");
            return;
        }

        if (!Blockchain.isValidChain(chain)) {
            console.error("The incoming chain is not valid");
            return;
        }

        this.chain = chain; // Replace the chain with the incoming one
    }

    // Static method to validate a chain
    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }

        for (let i = 1; i < chain.length; i++) {
            const { previousHash, hash, data, timestamp } = chain[i];
            const lastBlock = chain[i - 1];

            // Validate the previousHash and hash
            if (previousHash !== lastBlock.hash) return false;
            if (hash !== cryptoHash(timestamp, previousHash, data)) return false;
        }

        return true;
    }
}

module.exports = Blockchain;
