const express = require("express");
const bodyParser = require("body-parser"); // To parse JSON requests
const request=require("request");
const BlockchainClass = require('./blockchain'); // Import Blockchain class
const PubSub = require("./publishsubscribe"); // Correct file name if necessary

// Create an instance of Blockchain
const blockchain = new BlockchainClass();
const pubsub = new PubSub(blockchain); // Fixed typo: PubSub was misspelled as "Pubsub"

const app = express();

const DEFAULT_PORT = 3000;

const ROOT_NODE_ADDRESS=`https://localhost:${DEFAULT_PORT}`;
setTimeout(()=>pubsub.broadcastChain(),1000);


// Middleware to parse JSON
app.use(bodyParser.json()); // Alternatively: app.use(express.json());

// GET route to retrieve all blocks
app.get('/api/blocks', (req, res) => {
    res.json({
        chain: blockchain.chain,
        message: 'Blockchain retrieved successfully'
    });
});

// POST route for mining a new block
app.post('/api/mine', (req, res) => {
    const { data } = req.body; // Extract data from the request body

    // If no data is provided, return a 400 error
    if (!data) {
        return res.status(400).json({ error: 'Data is required to mine a block' });
    }

    // Add the new block with the provided data
    const newBlock = blockchain.addBlock(data);

    // Log the new block to the console for debugging
    console.log('New block mined:', newBlock);

    // Broadcast the updated blockchain to the network
    pubsub.broadcastChain();

    // Respond with a success message and the newly added block
    res.status(201).json({
        message: 'New block added successfully',
        block: newBlock
    });
});

// Default route to handle unknown paths
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});
const synChains=()=>{
    request({url:`${ROOT_NODE_ADDRESS}/api/blocks`},(error,reposnse,body)=>{
        if(!error && reposnse.statusCode===200){
            const rootChain=JSON.parse(body);
           console.log('Replace chain on sync with',rootChain);
           blockchain.replaceChain(rootChain)
        }
    })
}

// Set up the server to listen on port 3000
let PEER_PORT;
if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);  
} else {
    PEER_PORT = DEFAULT_PORT;
}

// Ensure PEER_PORT is used for the server
const PORT = PEER_PORT;
app.listen(PORT, () => {

    console.log(`listening to PORT:${PORT}`);
    synChains();
});
