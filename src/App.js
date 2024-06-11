import React, {useEffect, useState} from 'react';
import './App.css';
import {createWallet, getBalance, createTransfer} from './tonUtils';

const TON_ADDRESS = 'UQClXO69V6LqEtlPId-WBJa3RyggyTS_8NJciV5kV2nnauuR'; // Your TON address

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [wallet, setWallet] = useState(null);
    const [balance, setBalance] = useState(null);
    const [transactionStatus, setTransactionStatus] = useState(null);

    useEffect(() => {
        const init = async () => {
            try {
                if (window.Telegram && window.Telegram.WebApp) {
                    const tg = window.Telegram.WebApp;
                    tg.ready();

                    const initDataUnsafe = tg.initDataUnsafe || {};
                    setUser(initDataUnsafe.user);

                    const {wallet, keyPair} = await createWallet();
                    setWallet(wallet);

                    const balance = await getBalance(wallet);
                    setBalance(balance);

                    tg.MainButton.text = "Buy with TON";
                    tg.MainButton.show();

                    tg.MainButton.onClick(async () => {
                        try {
                            const transfer = await createTransfer(wallet, keyPair, TON_ADDRESS, '100000', 'Payment for virtual item');
                            setTransactionStatus('Transaction successful');
                        } catch (error) {
                            setTransactionStatus(`Transaction failed: ${error.message}`);
                        }
                    });

                    setLoading(false);
                } else {
                    setError(true);
                    setLoading(false);
                }
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };

        init();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Failed to load the app. Please try again.</div>;
    }

    return (
        <div className="App">
            <h1>Welcome, {user?.first_name}</h1>
            <p>Your wallet balance: {balance}</p>
            {transactionStatus && <p>{transactionStatus}</p>}
        </div>
    );
}

export default App;
