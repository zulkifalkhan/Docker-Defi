interface Transaction {
  to: string;
  from: string;
  amount: Number;
  publicKey: string;
  signature: string;
}

export default Transaction;
