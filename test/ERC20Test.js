let accounts;

const ERC20Basic = artifacts.require('./ERC20Basic');

const toBN = web3.utils.toBN;

describe('ERC20Test', () => {
  beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
  });

  it('should put 10000 ERC20Basic in the first account', async () => {
    const ERC20BasicInstance = await ERC20Basic.deployed(10000);
    const balance = await ERC20BasicInstance.balanceOf.call(accounts[0]);

    assert.equal(balance.valueOf(), 10000, '10000 was not in the first account');
  });

  it('should transfer token correctly', async () => {
    const ERC20BasicInstance = await ERC20Basic.deployed(10000);

    const accountOne = accounts[0];
    const accountTwo = accounts[1];

    const accountOneStartingBalance = toBN(await ERC20BasicInstance.balanceOf.call(accountOne));
    const accountTwoStartingBalance = toBN(await ERC20BasicInstance.balanceOf.call(accountTwo));

    const amount = toBN(10);

    await ERC20BasicInstance.transfer(accountTwo, amount, { from: accountOne });

    const accountOneEndingBalance = toBN(await ERC20BasicInstance.balanceOf.call(accountOne));
    const accountTwoEndingBalance = toBN(await ERC20BasicInstance.balanceOf.call(accountTwo));

    assert.isTrue(accountOneEndingBalance.eq(accountOneStartingBalance.sub(amount)), 'Amount was not correctly taken from sender');
    assert.isTrue(accountTwoEndingBalance.eq(accountTwoStartingBalance.add(amount)), 'Amount was not correctly sent to receiver');
  });

  it('should set allowance correctly', async () => {
    const ERC20BasicInstance = await ERC20Basic.deployed(10000);

    const accountSender = accounts[0];
    const accountSpender = accounts[1];

    const currentAllowance = toBN(await ERC20BasicInstance.allowance.call(accountSender, accountSpender));
    assert.isTrue(currentAllowance.eq(toBN(0)), 'Initial allowance amount is not 0');

    const allowanceAmount = toBN(3);

    await ERC20BasicInstance.approve(accountSpender, allowanceAmount, { from: accountSender });
    const updatedAllowance = toBN(await ERC20BasicInstance.allowance.call(accountSender, accountSpender));

    assert.isTrue(updatedAllowance.eq(toBN(3)), 'Initial allowance amount was not changed correctly');
  });

  it('should transferFrom token correctly', async () => {
    const ERC20BasicInstance = await ERC20Basic.deployed(10000);

    const accountSender = accounts[0];
    const accountSpender = accounts[1];
    const accountRecipient = accounts[2];

    const allowanceAmount = toBN(3);

    await ERC20BasicInstance.approve(accountSpender, allowanceAmount, { from: accountSender });

    const accountSenderStartingBalance = toBN(await ERC20BasicInstance.balanceOf.call(accountSender));
    const accountRecipientStartingBalance = toBN(await ERC20BasicInstance.balanceOf.call(accountRecipient));

    const amount = toBN(1);
  
    await ERC20BasicInstance.transferFrom(accountSender, accountRecipient, amount, { from: accountSpender });

    const accountSenderEndingBalance = toBN(await ERC20BasicInstance.balanceOf.call(accountSender));
    const accountRecipientEndingBalance = toBN(await ERC20BasicInstance.balanceOf.call(accountRecipient));

    assert.isTrue(accountSenderEndingBalance.eq(accountSenderStartingBalance.sub(amount)), 'Amount was not correctly taken from sender');
    assert.isTrue(accountRecipientEndingBalance.eq(accountRecipientStartingBalance.add(amount)), 'Amount was not correctly sent to recipient');
  })
});