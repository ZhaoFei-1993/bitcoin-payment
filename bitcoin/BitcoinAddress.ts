import { BitcoinTransaction } from "./BitcoinTransaction";

/**
 *  ビットコインアドレス
 */
 export class BitcoinAddress {
   public address: string;
   public total_received: number;
   public last_confirmation: number;
   public txs: BitcoinTransaction[];
 }
