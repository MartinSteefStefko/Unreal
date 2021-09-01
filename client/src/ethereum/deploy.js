const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
  'wild yard stomach scrub margin leader slender record normal awake until evoke',
  'https://rinkeby.infura.io/v3/0cca091079a94288bac11e628dec8e24'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: '10000000', from: accounts[0], gasPrice: '5000000000' });

  console.log('Contract deployed to', result.options.address);
};
deploy();
