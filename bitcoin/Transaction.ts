import blockexplorer = require('blockchain.info/blockexplorer');
import rp = require('request-promise-native');

import { BitcoinAddress } from "./BitcoinAddress";
import { BitcoinTransaction } from "./BitcoinTransaction";

/**
 *  ビットコイントランザクション
 */
export class Transaction {
  /**
   *  最新のブロック総数を取得
   */
  public static getBlockCount(): Promise<number> {
    let url = 'https://blockchain.info/ja/q/getblockcount';
    return rp(url)
      .then((body: string) => {
        let count = parseInt(body.trim());
        if (isNaN(count)) {
          return -1;
        }
        return count;
      });
  }

  /**
   *  指定のアドレスの情報を取得
   */
  public static getAddress(address): Promise<BitcoinAddress> {
    // 最新のブロック総数を取得
    return Transaction.getBlockCount()
      .then((count: number) => {
        // アドレス情報を取得
        return blockexplorer.getAddress(address)
          .then((result) => {
            let bitcoinAddress = new BitcoinAddress();
            bitcoinAddress.address = address;
            bitcoinAddress.total_received = result.total_received / 100000000;
            bitcoinAddress.last_confirmation = 0;
            bitcoinAddress.txs = [];

            // トランザクションの承認数を確認
            if (result.txs && result.txs.length > 0) {
              for (let i = 0; i < result.txs.length; i++) {
                let tx = result.txs[i];
                let bitcoinTransaction = new BitcoinTransaction();
                bitcoinTransaction.block_height = tx.block_height ? tx.block_height : count;
                bitcoinTransaction.confirmation = Math.max(0, count - tx.block_height);
                bitcoinTransaction.confirmation = !isNaN(bitcoinTransaction.confirmation) ? bitcoinTransaction.confirmation : 0;
                if (bitcoinAddress.last_confirmation == 0) {
                  bitcoinAddress.last_confirmation = bitcoinTransaction.confirmation;
                } else {
                  bitcoinAddress.last_confirmation = Math.min(bitcoinAddress.last_confirmation, bitcoinTransaction.confirmation);
                }
                bitcoinTransaction.btc_amount = 0;
                for (let j = 0; j < tx.out.length; j++) {
                  let out = tx.out[j];
                  if (out.addr == address) {
                    bitcoinTransaction.btc_amount += out.value / 100000000;
                  }
                }
                bitcoinAddress.txs.push(bitcoinTransaction);
              }
            }

            return bitcoinAddress;
          });
      });
  }
}
