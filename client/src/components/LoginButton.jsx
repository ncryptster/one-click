 import React from 'react';
import Web3 from 'web3';

function LoginButton() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const handleClick = async () => {
    if (window.ethereum) {
      // Check if ethereum object exists
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        window.web3 = new Web3(window.ethereum); // inject provider
        const accountsResponse = await window.web3.eth.requestAccounts();
        const publicAddress = accountsResponse[0];
        console.log('publicAddress', publicAddress);
        const response = await fetch(`http://localhost:3000/login?publicAddress=${publicAddress}`);
        const { nonce } = await response.json();
        const message = `Hi there from OneClick! Sign this message to prove you have access to this wallet and we’ll log you in. This won’t cost you any Ether.
        To stop hackers using your wallet, here’s a unique message ID they can’t guess: ${nonce};` // The message to sign is just the nonce
        const signedMessage = await web3.eth.personal.sign(message, publicAddress);
        const authResponse = async () => { await fetch(`http://localhost:3000/authenticate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicAddress, signedMessage, nonce }),
        });
        };
        const { token } = await authResponse;
        document.cookie = `jwt=${token}; path=/; httpOnly`;
        setIsAuthenticated(true);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    }
  };

  return (
    <div>
      {isAuthenticated ? 'Authenticated' : <button onClick={handleClick}>Login</button>}
    </div>
  );
}

export default LoginButton;