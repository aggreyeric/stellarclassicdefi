"use client"

import { retrievePublicKey, checkConnection, userSignTransaction } from "../components/fry";
import { useState, useEffect } from 'react';
import { Asset, TransactionBuilder, Operation, Networks, Server } from '@stellar/stellar-sdk';

export const swaptoken = async (token1, token2, amount) => {
    try {
        await checkConnection();
        const publicKey = await retrievePublicKey();
        const server = new Server('https://horizon-testnet.stellar.org');
        const account = await server.loadAccount(publicKey);

        const asset1 = token1 === 'XLM' ? Asset.native() : new Asset(token1, publicKey);
        const asset2 = token2 === 'XLM' ? Asset.native() : new Asset(token2, publicKey);

        const transaction = new TransactionBuilder(account, {
            fee: await server.fetchBaseFee(),
            networkPassphrase: Networks.TESTNET
        })
            .addOperation(Operation.pathPaymentStrictSend({
                sendAsset: asset1,
                sendAmount: amount,
                destination: publicKey,
                destAsset: asset2,
                destMin: '0', // Set a minimum amount to receive, adjust as needed
            }))
            .setTimeout(30)
            .build();

        const signedTransaction = await userSignTransaction(
            transaction.toXDR(),
            Networks.TESTNET,
            publicKey
        );

        const response = await server.submitTransaction(signedTransaction);
        return response.hash;
    } catch (error) {
        console.error('Swap failed:', error);
        throw error;
    }
};

const TokenSwap = () => {
    const [token1, setToken1] = useState('XLM');
    const [amount, setAmount] = useState('');
    const [token2, setToken2] = useState('TFORINT');
    const [transactionHash, setTransactionHash] = useState('');
    const [transactionStatus, setTransactionStatus] = useState('');
    const [isWalletConnected, setIsWalletConnected] = useState(false);

    useEffect(() => {
        const checkWalletConnection = async () => {
            const connected = await checkConnection();
            setIsWalletConnected(connected);
        };
        checkWalletConnection();
    }, []);

    const handleSwap = async () => {
        if (!isWalletConnected) {
            alert('Please connect your wallet');
            return;
        }
        setTransactionStatus('pending');
        try {
            const tx = await swaptoken(token1, token2, amount);
            setTransactionHash(tx);
            setTransactionStatus('completed');
        } catch (error) {
            console.error('Swap error:', error);
            setTransactionStatus('failed');
        }
    };

    return (
        <div className='w-[40%] h-[100%] bg-gray-300 rounded-full m-auto items-center'>
            <form className='flex flex-col gap-4 text-3xl items-center'>
                <label className='flex flex-col mt-10'>
                    <select className='text-black bg-gray-300' value={token1} onChange={(e) => setToken1(e.target.value)}>
                        <option value="XLM">XLM</option>
                        <option value="TFORINT">TFORINT</option>
                    </select>
                </label>
                
                <input className='text-black bg-gray-400 rounded-full' type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                
                <label>
                    <select className='text-black bg-gray-300' value={token2} onChange={(e) => setToken2(e.target.value)}>
                        <option value="XLM">XLM</option>
                        <option value="TFORINT">TFORINT</option>
                    </select>
                </label>
                
                <button className='mt-10 bg-black text-white rounded-full p-4 w-[30%] mb-10' type="button" onClick={handleSwap}>
                    Swap
                </button>
            </form>
            
            {transactionStatus === 'pending' && (
                <div className='mb-12 text-black text-xl text-center'>
                    <h3>Transaction Pending...</h3>
                </div>
            )}
            
            {transactionStatus === 'completed' && (
                <div className='mb-12 text-black text-xl text-center'>
                    <h3>Transaction Completed!</h3>
                    <a href={`https://stellar.expert/explorer/testnet/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
                        View Transaction on Stellar Expert
                    </a>
                </div>
            )}
            
            {transactionStatus === 'failed' && (
                <div className='mb-12 text-red-500 text-xl text-center'>
                    <h3>Transaction Failed. Please try again.</h3>
                </div>
            )}
        </div>
    );
};

export default TokenSwap;