"use client"

import { useState, useEffect } from 'react';

const TransactionDialog = ({ transactionHash, transactionStatus }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (transactionStatus === 'completed') {
      setIsOpen(true);
    }
  }, [transactionStatus]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      {isOpen && (
        <div>
          <h3>Transaction Completed!</h3>
          <a href={`https://etherscan.io/tx/${transactionHash}`} target="_blank">
            View Transaction on Etherscan
          </a>
          <button onClick={handleClose}>Close</button>
        </div>
      )}
    </div>
  );
};

export default TransactionDialog;