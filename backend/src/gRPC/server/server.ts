const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { createVerify } = require("crypto");
const path = require("path");

const PROTO_PATH = path.join(__dirname, "transaction.proto");

// Load proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const transactionProto =
  grpc.loadPackageDefinition(packageDefinition).transaction;

// Function to verify a transaction
const verifyTransaction = (call, callback) => {
  const { to, from, amount, publicKey, signature } = call.request;
  const transactionData = `${to}${from}${amount}`;

  const verify = createVerify("SHA256");
  verify.update(transactionData);
  verify.end();

  const isValid = verify.verify(publicKey, signature);

  callback(null, { verified: isValid });
};

const gRPCServer = new grpc.Server();
gRPCServer.addService(transactionProto.TransactionService.service, {
  VerifyTransaction: verifyTransaction,
});

gRPCServer.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("gRPC server running at http://0.0.0.0:50051");
    gRPCServer.start();
  }
);

export default gRPCServer;
