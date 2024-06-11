import { TonClient, WalletContractV4, internal } from "@ton/ton";
import { mnemonicNew, mnemonicToPrivateKey } from "@ton/crypto";

// Initialize TON client
const client = new TonClient({ endpoint: 'https://toncenter.com/api/v2/jsonRPC' });

export const createWallet = async () => {
    const mnemonics = await mnemonicNew();
    const keyPair = await mnemonicToPrivateKey(mnemonics);
    const wallet = WalletContractV4.create({ workchain: 0, publicKey: keyPair.publicKey });
    return { wallet, keyPair, mnemonics };
};

export const getBalance = async (wallet) => {
    const contract = client.open(wallet);
    const balance = await contract.getBalance();
    return balance;
};

export const createTransfer = async (wallet, keyPair, to, value, message) => {
    const contract = client.open(wallet);
    const transfer = await contract.createTransfer({
        seqno: await contract.getSeqno(),
        secretKey: keyPair.secretKey,
        messages: [internal({
            value: value,
            to: to,
            body: message,
        })]
    });
    return transfer;
};
