require("@nomicfoundation/hardhat-toolbox");

const GOERLI_PRIVATE_KEY = "0xd7ff6d2e0c08db579b45b0aa1c19dcc9463a7ef2e1b2ab78684293cbb16b4fb2"; // curve veteran quantum focus wave wolf soap wash frown album grace object

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/FCpw40KD3KFKKdFp7rMEbJVJRzK2G11q",
      accounts: [GOERLI_PRIVATE_KEY]
    }
  }
};
