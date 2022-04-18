import { useState, useEffect } from "react";
import Web3 from "web3";
import NFTContract from "./NFT.json";

function App() {
  const [currentAccount, setCurrentAccount] = useState();
  const [nftContract, setNftContract] = useState();
  const [balance, setBalance] = useState();
  const [transactionHash, setTransactionHash] = useState({
    status: false,
    Hash: "",
  });

  useEffect(() => {
    const init = async () => {
      const provider = window.ethereum;

      provider
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          setCurrentAccount(accounts[0]);
          console.log("current account " + currentAccount);
        })
        .catch((err) => console.log(err));

      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      const contract = new web3.eth.Contract(
        NFTContract.abi,
        NFTContract.networks[networkId].address
      );
      setNftContract(contract);
    };
    init();
  }, [currentAccount]);

  const mintToken = () => {
    nftContract.methods
      .mint(currentAccount)
      .send({ from: currentAccount })
      .then((res) =>
        setTransactionHash({ status: true, Hash: res.transactionHash })
      )
      .catch((err) => console.log(err));
  };

  const getBalance = () => {
    nftContract.methods
      .balanceOf(currentAccount)
      .call()
      .then((bal) => {
        setBalance(bal);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container">
      <div className="sub-container">
        <div className="address">Address: {currentAccount}</div>
        {balance && <div className="balance">Balance: {balance}</div>}
        {transactionHash.status && (
          <div className="transaction-hash">TransactionHash: {transactionHash.Hash}</div>
        )}
        <div className="buttons">
          <button className="button" onClick={mintToken}>
            Mint
          </button>
          <button className="button" onClick={getBalance}>
            Get Balance
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
