const Web3 = require('web3');
const Contract = require('web3-eth-contract');
const ERC20BasicJSON = require('../build/contracts/ERC20Basic.json');

let contractAddress = '0x3F3b46d38ffE9854ff210e47306B82FceC84dEB2';
let recipient = '0x04967571B6a20E5019C45faC2DA747Cb0c6A000E';
let spender = '0xb64628e69A1d8AaD63471d9890eAA5Aaf6C8CC67';

async function test() {
  let web3 = await new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
  await Contract.setProvider('http://localhost:8545');

  let address;

  await web3.eth.getAccounts()
    .then(res => address = res[0]);

  console.log('Address: ', address);

  await web3.eth.getBalance(address)
    .then(res => console.log('Balance: ', res));

  let ERC20Basic = await new Contract(ERC20BasicJSON.abi, contractAddress);

  await ERC20Basic.methods.balanceOf(address).call()
    .then(res => console.log('Token balance for recipient: ', res));

  await ERC20Basic.methods.balanceOf(spender).call()
    .then(res => console.log('Token balance of spender account: ', res));

  await ERC20Basic.methods.balanceOf(recipient).call()
    .then(res => console.log('Token balance of recipient account: ', res));
  
  await ERC20Basic.methods.transfer(recipient, '1').send({ from: address })
    .on('transactionHash', hash => console.log('hash: ', hash))
    .on('receipt', receipt => console.log(receipt))
    .on('error', (error, receipt) => console.log(error));
    
  await ERC20Basic.getPastEvents('Transfer', {
    fromBlock: 8153950,
    toBlock: 'latest',
  }, (error, events) => {
    console.log(events);
  });

  approve
  await ERC20Basic.methods.approve(spender, '2').send({ from: address })
    .on('transactionHash', hash => console.log('hash: ', hash))
    .on('receipt', receipt => console.log(receipt))
    .on('error', (error, receipt) => console.log(error));

  await ERC20Basic.methods.transferFrom(address, recipient, '1').send({ from: spender })
    .on('transactionHash', hash => console.log('hash: ', hash))
    .on('receipt', receipt => console.log(receipt))
    .on('error', (error, receipt) => console.log(error));

  await ERC20Basic.getPastEvents('Approval', {
    fromBlock: 8153950,
    toBlock: 'latest',
  }, (error, events) => {
    console.log(events);
  });
}

test();
