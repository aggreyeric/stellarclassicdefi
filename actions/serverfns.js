import { Keypair, Asset, TransactionBuilder, SorobanRpc, Operation, BASE_FEE, Networks, LiquidityPoolAsset, LiquidityPoolId } from "@stellar/stellar-sdk";
import fetch from "node-fetch";




const fundUsingFriendbot = async (address) => {

    const friendbotUrl = `https://friendbot.stellar.org?addr=${address}`
    try {
        const response = await fetch(friendbotUrl)
        if (response.ok) {
            return true
        } else {
            throw new Error(`Failed to fund account: ${response.status} ${response.statusText}`)
        }
    } catch (error) {
        console.error(error)
        return false
    }

}


const pair = Keypair.random();


console.log(`Public Key: ${pair.publicKey()}`);
console.log(`Secret Key: ${pair.secret()}`);


await fundUsingFriendbot(pair.publicKey())


const server = new SorobanRpc("https://horizon-testnet.stellar.org");

const account = await server.getAccount(pair.publicKey());

const Sabiasset = new Asset("Sabit", pair.publicKey());

const lpassets = new LiquidityPoolAsset(Asset.native(), Sabiasset, 30);

const lpid = new LiquidityPoolId("constant-product", lpassets);





const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET
}).addOperation(Operation.changeTrust({ line: lpassets }))
    .addOperation(Operation.liquidityPoolDeposit({
        liquidityPoolId: lpid,
        maxAmountA: 10000,
        maxAmountB: 10000,
        minPrice: {
            n: 1,
            d: 1
        },
        maxPrice: {
            n: 1,
            d: 1
        }
    })).setTimeout(180).build();

    
    transaction.sign(pair);


    try {
        const response = await server.sendTransaction(transaction);
        console.log("Transaction hash:", "https://stellar.expert/explorer/testnet/tx/" + response.hash);
        console.log("Success! View your transaction at:", "https://stellar.expert/explorer/testnet/tx/" + response.hash);``
    } catch (error) {
        console.log(`${error}   More details: ${JSON.stringify(error.response.data.extras, null, 2)}`);
    }






    
    const traderKeypair = Keypair.random();
    
    await fundUsingFriendbot(traderKeypair.publicKey())


    const traderAccount = await server.getAccount(traderKeypair.publicKey());

    const transaction2 = new TransactionBuilder(traderAccount, {  fee: BASE_FEE, networkPassphrase: Networks.TESTNET  }).
    addOperation(Operation.changeTrust({asset: Sabiasset, source: traderKeypair.publicKey()}))
    .addOperation(Operation.pathPaymentStrictReceive({
        sendAsset: Asset.native(),
        sendMax: "1000",
        destination: traderAccount.publicKey(),
        destAsset: sabiasset,
        destAmount: "200",
        source: traderKeypair.publicKey()
        
    })).setTimeout(40).build();

    transaction2.sign(traderKeypair);

    try {
        const response = await server.sendTransaction(transaction2);
        console.log("Transaction2 hash:", "https://stellar.expert/explorer/testnet/tx/" + response.hash);
        console.log("Success! View your transaction at:", "https://stellar.expert/explorer/testnet/tx/" + response.hash);``
    } catch (error) {
        console.log(`${error}   More details: ${JSON.stringify(error.response.data.extras, null, 2)}`);
    }



    const Withdrawallpool = new TransactionBuilder(traderAccount, {  fee: BASE_FEE, networkPassphrase: Networks.TESTNET  }).
    addOperation(Operation.changeTrust({asset: sabiasset, source: traderKeypair.publicKey()}))
    .addOperation(Operation.liquidityPoolWithdraw({
        liquidityPoolId: lpid,
        amount: "100",
        minAmountA: "0",
        minAmountB: "0",
    })).setTimeout(40).build();

    Withdrawallpool.sign(traderKeypair);

    try {
        const response = await server.sendTransaction(Withdrawallpool);
        console.log("Transaction3 hash:", "https://stellar.expert/explorer/testnet/tx/" + response.hash);
        console.log("Success! View your transaction at:", "https://stellar.expert/explorer/testnet/tx/" + response.hash);``
    } catch (error) {
        console.log(`${error}   More details: ${JSON.stringify(error.response.data.extras, null, 2)}`);
    }