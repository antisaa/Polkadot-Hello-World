const { ApiPromise, WsProvider } = require("@polkadot/api");

function printBlock(blockHash, blockHeader){
  console.log(`------------------------\nDetails about block\n------------------------`);
  console.log(`Block hash\t ${blockHash}`);
  console.log(`Block number\t ${blockHeader.number.toString()}`);
  console.log(`Author\t\t ${blockHeader.author.toString()}`);
  console.log(`Parent hash\t ${blockHeader.parentHash.toHex()}`);
  console.log(`State root\t ${blockHeader.stateRoot.toHex()}`);
  console.log(`Eternistic root\t ${blockHeader.extrinsicsRoot.toHex()}`);
}

async function main() {
  const params = process.argv.slice(2);

  const provider = new WsProvider("wss://kusama-rpc.polkadot.io");
  const api = await ApiPromise.create({ provider });

  const [chain, nodeName, nodeVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version(),
  ]);
  console.log(
    `You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`
  );

  if (params[0] == '--hash' && params[1]) {
    const block = await api.rpc.chain.getBlock(params[1]);
    const blockHeader = await api.derive.chain.getHeader(params[1]);
    printBlock(params[1], blockHeader)
  }
  else {
    const blockHash = await api.rpc.chain.getBlockHash();
    const blockHeader = await api.derive.chain.getHeader(blockHash);
    printBlock(blockHash, blockHeader)
  }
}


main()
  .catch(console.error)
  .finally(() => process.exit());
