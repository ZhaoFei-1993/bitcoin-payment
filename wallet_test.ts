import { BitcoinAddress } from "models/bitcoin/BitcoinAddress";
import { Transaction } from "models/bitcoin/Transaction";
import { Wallet } from "models/bitcoin/Wallet";

// tx_indexは0スタートのインクリメント値
let paymentAddress = Wallet.createPaymentAddress(0);
console.log('paymentAddress', paymentAddress);

Transaction.getAddress(paymentAddress)
  .then((bitcoinAddress: BitcoinAddress) => {
    console.log('bitcoinAddress', bitcoinAddress);
  });
