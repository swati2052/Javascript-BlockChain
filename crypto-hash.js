const crypto = require("crypto");

const cryptoHash = (...inputs) => {
    const hash = crypto.createHash("sha256");
    hash.update(inputs.sort().join(""));
    return hash.digest("hex");
};

// Correctly calling the cryptoHash function
const result = cryptoHash("world", "hello");
//console.log(result);
module.exports=cryptoHash;
