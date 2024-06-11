import {internal, TonClient, WalletContractV4} from "@ton/ton";
import {mnemonicNew, mnemonicToPrivateKey} from "@ton/crypto";

// Initialize TON client
const client = new TonClient({endpoint: 'https://toncenter.com/api/v2/jsonRPC'});

export const createWallet = async () => {
    const mnemonics = await mnemonicNew();
    const keyPair = await mnemonicToPrivateKey(mnemonics);
    const wallet = WalletContractV4.create({workchain: 0, publicKey: keyPair.publicKey});
    return {wallet, keyPair, mnemonics};
};

export const getBalance = async (wallet) => {
    const contract = client.open(wallet);
    return await contract.getBalance();
};

export const createTransfer = async (wallet, keyPair, to, value, message) => {
    const contract = client.open(wallet);
    return await contract.createTransfer({
        seqno: await contract.getSeqno(),
        secretKey: keyPair.secretKey,
        messages: [internal({
            value: value,
            to: to,
            body: message,
        })]
    });
};
