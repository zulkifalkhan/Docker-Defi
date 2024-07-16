import gRPCServer from "./gRPC";

const express = require("express");
const { appendTransaction } = require("./utils/transactionHelper");
const Transaction = require("./dto/transaction");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const app = express();
const port = 3000;

gRPCServer;

// Load gRPC proto file
const PROTO_PATH = path.join(__dirname, "./transaction.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const transactionProto =
  grpc.loadPackageDefinition(packageDefinition).transaction;

// gRPC Client setup
const grpcClient = new transactionProto.TransactionService(
  "localhost:50051", // Adjust this based on your gRPC server address and port
  grpc.credentials.createInsecure()
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

/**
 * Endpoint for creating a tx and storing it in a file in a blockchain manner.
 * A tx should have from, to, amount, publicKey and signature as attributes.
 * Then add your public and private key by yourself and then use a verification method in this endpoint.
 */
app.post("/createTransaction", async (req, res) => {
  const { to, from, amount, publicKey, signature } = req.body;

  // Example: Verify transaction using gRPC client
  grpcClient.verifyTransaction(
    { to, from, amount, publicKey, signature },
    (error, response) => {
      if (error) {
        console.error("Error verifying transaction:", error);
        res.status(500).send("Error verifying transaction");
        return;
      }

      if (response.verified) {
        // Transaction is verified, append it
        appendTransaction(to, from, amount)
          .then(() => {
            res.send("Transaction appended");
          })
          .catch((err) => {
            console.error("Error appending transaction:", err);
            res.status(500).send("Error appending transaction");
          });
      } else {
        // Transaction verification failed
        res.status(400).send("Transaction verification failed");
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Express is listening at http://localhost:${port}`);
});
