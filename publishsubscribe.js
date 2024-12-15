const redis = require('redis');

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
};

class PubSub {
    constructor(blockchain) {
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();
        this.blockchain = blockchain;

        // Subscribe to the channels
        this.subscriber.subscribe(CHANNELS.TEST);
        this.subscriber.subscribe(CHANNELS.BLOCKCHAIN);

        // Bind the message event to handleMessage
        this.subscriber.on('message', (channel, message) => this.handleMessage(channel, message));
    }

    handleMessage(channel, message) {
        console.log(`Message received. Channel: ${channel}, Message: ${message}`);

        const parsedMessage = JSON.parse(message); // Use parsedMessage instead of parseMessage
        //console.log(parsedMessage);

        if (channel === CHANNELS.BLOCKCHAIN) {
            // Use the parsedMessage variable here
            this.blockchain.replaceChain(parsedMessage);
        }
    }

    publish({ channel, message }) {
        this.publisher.publish(channel, message);
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain),
        });
    }
}

module.exports = PubSub;
