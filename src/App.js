import React, { useEffect, useState } from 'react';
import './App.css';
import TonConnect from '@tonconnect/sdk';

const TON_ADDRESS = 'UQClXO69V6LqEtlPId-WBJa3RyggyTS_8NJciV5kV2nnauuR';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [transactionStatus, setTransactionStatus] = useState(null);

    useEffect(() => {
        const tonConnect = new TonConnect();

        if (window.Telegram && window.Telegram.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.ready();

            const initDataUnsafe = tg.initDataUnsafe || {};
            setUser(initDataUnsafe.user);

            tg.MainButton.text = "Pay with TON";
            tg.MainButton.show();

            tg.MainButton.onClick(async () => {
                try {
                    // Example of creating a payment request
                    const paymentRequest = {
                        to: TON_ADDRESS,
                        amount: '100000', // Amount in nanotons (1 TON = 1e9 nanotons)
                        stateInit: '',
                        data: 'Payment for services'
                    };

                    // Connect to the user's wallet and request a payment
                    const connectionResult = await tonConnect.connectWallet();
                    if (connectionResult.status === 'success') {
                        const paymentResult = await tonConnect.createTransfer(paymentRequest);
                        if (paymentResult.status === 'success') {
                            setTransactionStatus('Transaction successful');
                        } else {
                            setTransactionStatus('Transaction failed');
                        }
                    } else {
                        setTransactionStatus('Wallet connection failed');
                    }
                } catch (error) {
                    setTransactionStatus(`Transaction failed: ${error.message}`);
                }
            });

            setLoading(false);
        } else {
            setError(true);
            setLoading(false);
        }
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
            {transactionStatus && <p>{transactionStatus}</p>}
        </div>
    );
}

export default App;
