import bitcoin = require('bitcoinjs-lib');
import bip39 = require('bip39');

const mnemonicToM = (mnemonic, password, network) => {
    const seed = bip39.mnemonicToSeed(mnemonic, password || "")
    const m = bitcoin.HDNode.fromSeedBuffer(seed, bitcoin.networks[network || "bitcoin"])
    return m
}
const mnemonic = 'リカバリーフレーズ';

/**
 *  ビットコインウォレット
 */
export class Wallet {
  /**
   *  支払い用アドレス生成
   */
  public static createPaymentAddress(tx_index: number) {
    const m = mnemonicToM(mnemonic, '', 'bitcoin');  // 秘密鍵
    // console.log(m.derivePath("m/44'/0'/0'").toBase58()); // xpriv...
    // console.log(m.derivePath("m/44'/0'/0'").neutered().toBase58());  // xpub...
    // console.log(m.derivePath("m/44'/0'/0'/0/0").getAddress()); // 1DQ...

    let paymentAddress = m.derivePath("m/44'/0'/0'/0/" + tx_index).getAddress();
    return paymentAddress;
  }
}
