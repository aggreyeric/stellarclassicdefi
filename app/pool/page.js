"use client"


import React, { useState } from 'react';
import { Keypair, Asset, TransactionBuilder, Operation, Networks, LiquidityPoolAsset, BASE_FEE, getLiquidityPoolId } from '@stellar/stellar-sdk';
import {  Horizon } from '@stellar/stellar-sdk';

const server = new Horizon.Server('https://horizon-testnet.stellar.org')

const StellarOperations = () => {
  const [keypair, setKeypair] = useState(null);
  const [assetName, setAssetName] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [liquidityPoolId, setLiquidityPoolId] = useState('');
  const [status, setStatus] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('');

  const generateKeypair = () => {
    const newKeypair = Keypair.random();
    setKeypair(newKeypair);
    setStatus(`Keypair generated. Public Key: ${newKeypair.publicKey()}`);
  };

  const fundAccount = async () => {
    if (!keypair) {
      setStatus('Please generate a keypair first');
      return;
    }

    const friendbotUrl = `https://friendbot.stellar.org?addr=${keypair.publicKey()}`;
    try {
      const response = await fetch(friendbotUrl);
      if (response.ok) {
        setStatus('Account funded successfully');
        setTransactionStatus('success');
        // Friendbot doesn't return a transaction hash, so we can't provide a link here
      } else {
        setStatus(`Failed to fund account: ${response.status} ${response.statusText}`);
        setTransactionStatus('failure');
      }
    } catch (error) {
      setStatus(`Error funding account: ${error.message}`);
      setTransactionStatus('failure');
    }
  };

  const createAssetAndLiquidityPool = async () => {
    console.log('createAssetAndLiquidityPool');
    console.log(keypair.publicKey());
    console.log(assetName);
     console.log(depositAmount);
    if (!keypair || !assetName || !depositAmount) {
      setStatus('Please provide all required information');
      return;
    }

    try {
      const account = await server.loadAccount(keypair.publicKey());
      const customAsset = new Asset(assetName, keypair.publicKey());
      const lp =  new LiquidityPoolAsset(Asset.native(), customAsset, 30);
     console.log(lp);
     console.log(account);
     console.log(customAsset);


      const lpid = new getLiquidityPoolId("constant_product", lp);

      console.log(lpid);



      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET
      })
        .addOperation(Operation.changeTrust({ line: lp }))
        .addOperation(Operation.liquidityPoolDeposit({
          liquidityPoolId: lpid,
          maxAmountA: 1000,
          maxAmountB: 1000,
          minPrice: { n: 1, d: 1 },
          maxPrice: { n: 1, d: 1 }
        }))
        .setTimeout(180)
        .build();

      transaction.sign(keypair);
      const response = await server.sendTransaction(transaction);
      setLiquidityPoolId(lpid.toString());
      setStatus(`Liquidity pool created. Transaction hash: ${response.hash}`);
      setTransactionHash(response.hash);
      setTransactionStatus('success');
    } catch (error) {
      setStatus(`Error creating liquidity pool: ${error.message}`);
      setTransactionStatus('failure');
    }
  };

  const withdrawFromLiquidityPool = async () => {
    if (!keypair || !liquidityPoolId || !withdrawAmount) {
      setStatus('Please provide all required information for withdrawal');
      return;
    }

    try {
      const account = await server.loadAccount(keypair.publicKey());
      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET
      })
        .addOperation(Operation.liquidityPoolWithdraw({
          liquidityPoolId: liquidityPoolId,
          amount: withdrawAmount,
          minAmountA: "0",
          minAmountB: "0",
        }))
        .setTimeout(180)
        .build();

      transaction.sign(keypair);
      const response = await server.sendTransaction(transaction);
      setStatus(`Withdrawal successful. Transaction hash: ${response.hash}`);
      setTransactionHash(response.hash);
      setTransactionStatus('success');
    } catch (error) {
      setStatus(`Error withdrawing from liquidity pool: ${error.message}`);
      setTransactionStatus('failure');
    }
  };

  const renderTransactionVerification = () => {
    if (!transactionStatus) return null;

    if (transactionStatus === 'success' && transactionHash) {
      return (
        <div>
          <p>Transaction successful!</p>
          <a href={`https://stellar.expert/explorer/testnet/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
            View transaction on Stellar Expert
          </a>
        </div>
      );
    } else if (transactionStatus === 'failure') {
      return (
        <div>
          <p>Transaction failed. Please check the status message for more details.</p>
        </div>
      );
    }
  };

  return (
    <div className='flex flex-col w-[80%] m-auto mt-10 '>
        <h2  className='text-2xl font-bold text-center mb-4'>Liquidity Pool Managemanent</h2>
      <button  className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'  onClick={generateKeypair}>Generate Keypair</button>
      {keypair && (
        <div className='flex flex-col w-[80%] m-auto '>
          <p>Public Key: {keypair.publicKey()}</p>
          <p>Secret Key: {keypair.secret()}</p>
    
        </div>
      )}

<button  className=' mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={fundAccount}>Fund Account</button>
      <input
      className='m-2 w-1/2 h-8 border-2 border-gray-300 rounded-md p-2 text-black'
        type="text"
        placeholder="Asset Name"
        value={assetName}
        onChange={(e) =>{

             if(e.target.value.length){


        setAssetName(e.target.value.trim());

        } }}
      />
      <input
        className='m-2 w-1/2 h-8 border-2 border-gray-300 rounded-md p-2 text-black'
        type="number"
        placeholder="Deposit Amount"
        value={depositAmount}
        onChange={(e) => setDepositAmount(e.target.value)}
      />
      <button className=' text-black bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'  onClick={createAssetAndLiquidityPool}>Create Asset and Liquidity Pool</button>
     
        <div>
          <p>Liquidity Pool ID: {liquidityPoolId}</p>
          <input
           className=' text-black m-2 w-1/2 h-8 border-2 border-gray-300 rounded-md p-2'
            type="number"
            placeholder="Withdraw Amount"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
          />
          <button  className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={withdrawFromLiquidityPool}>Withdraw from Liquidity Pool</button>
        </div>
      
      <p>Status: {status}</p>
      {renderTransactionVerification()}
    </div>
  );
};

export default StellarOperations;