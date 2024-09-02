"use client"

import { useState, useEffect } from 'react';


export const swaptoken = async (token1, token2, amount) => {


    return "hahdu3yytyttrotutruirtutu"


}


const TokenSwap = () => {
    const [token1, setToken1] = useState('XLM');
    const [amount, setAmount] = useState('');
    const [token2, setToken2] = useState('TFORINT');
    const [transactionHash, setTransactionHash] = useState('');
    const [transactionStatus, setTransactionStatus] = useState('');

    const handleSwap = async () => {
        // Implement swap logic here (e.g., using a smart contract or API call)
        const tx = await swaptoken(token1, token2,);
        setTransactionHash(tx);
        setTransactionStatus('pending');
    };

    useEffect(() => {
        if (transactionHash) {
            // Poll the transaction status and update the UI
            const intervalId = setInterval(async () => {

                setTransactionStatus('completed');

            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [transactionHash]);

    return (
        <div  className='w-[40%] h-[100%] bg-gray-300 rounded-full m-auto  items-center' >

            <form className='flex flex-col gap-4 text-3xl items-center'>
               
                <label className=' flex flex-col mt-10'>
            
                    <select className='text-black bg-gray-300 ' value={token1} onChange={(e) => setToken1(e.target.value)}>
                     
                        <option value="XML">XLM</option>
                        <option value="TFORINT">TFORINT</option>



                    </select>

                </label>
                
                   <input className='text-black bg-gray-400   rounded-full' type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                <label >
                   
                    <select className='text-black bg-gray-300 ' value={token2} onChange={(e) => setToken2(e.target.value)}>
                  
                        <option value="XML">XLM</option>
                        <option value="TFORINT">TFORINT</option>

                    </select>
                    {/* <input type="text" value={token2} onChange={(e) => setToken2(e.target.value)} /> */}
                </label>
                <button className='mt-10  bg-black text-white rounded-full p-4 w-[30%] mb-10' type="button" onClick={handleSwap}>
                    Swap
                </button>
            </form>
            {transactionStatus === 'completed' && (
                <div>
                    <h3>Transaction Completed!</h3>
                    <a href={`https://etherscan.io/tx/${transactionHash}`} target="_blank">
                        View Transaction on Etherscan
                    </a>
                </div>
            )}
        </div>
    );
};

export default TokenSwap;