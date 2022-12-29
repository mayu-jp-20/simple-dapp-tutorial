/*global ethereum, MetamaskOnboarding */

/*
The `piggybankContract` is compiled from:

  pragma solidity ^0.4.0;
  contract PiggyBank {

      uint private balance;
      address public owner;

      function PiggyBank() public {
          owner = msg.sender;
          balance = 0;
      }

      function deposit() public payable returns (uint) {
          balance += msg.value;
          return balance;
      }

      function withdraw(uint withdrawAmount) public returns (uint remainingBal) {
          require(msg.sender == owner);
          balance -= withdrawAmount;

          msg.sender.transfer(withdrawAmount);

          return balance;
      }
  }
*/


const forwarderOrigin = 'http://localhost:9010'

const initialize = () => {
  const onboardButton = document.getElementById('connectButton');
  const getAccountsButton = document.getElementById('getAccounts');
  const getAccountsResult = document.getElementById('getAccountsResult');

  const isMetaMaskInstalled = () => {
    const {ethereum} = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  }

  const onboarding = new MetaMaskOnboarding({forwarderOrigin});

  const onclickInstall = () => {
    onboardButton.innerText = 'Onboarding in progress';
    onboardButton.disabled = true;
    onboarding.startOnboarding();
  }

  const onClickConnect = async () => {
    try{
      await ethereum.request({method: 'eth_requestAccounts'});
    }catch(error){
      console.error(error);
    }
  }

  const MetaMaskClientCheck = () => {
    if(!isMetaMaskInstalled()){
      onboardButton.innerText = 'Click here to install MetaMask!';
      onboardButton.onclick = onclickInstall;
      onboardButton.disabled = false;
    }else{
      onboardButton.innerText = 'Connect';
      onboardButton.onclick = onClickConnect;
      onboardButton.disabled = false;
    }
  };

  getAccountsButton.addEventListener('click',async() => {
    const accounts = await ethereum.request({method: 'eth_accounts'});
    getAccountsResult.innerText = accounts[0] || 'Not able to get accounts';
  })

  MetaMaskClientCheck();
}
window.addEventListener('DOMContentLoaded', initialize)
