const { ethers, formatUnits, uint256 } = require("ethers");

// const USDC = "0xdac17f958d2ee523a2206206994597c13d831ec7";
const SSTT_GOERLI = "0x13212Ee82E34ecece4E93ba641259326178Ee202";
const SSTT_MUMBAI = "0x19F5ef33Aace433e36e7Cb20f9F7f6c5e7C517B4";
const SSTT_FANTOM = "0x2f3984aabb7aa926837fd06961b05a2ae57a7b84";
const SSTT_AVALANCE = "0x99b5ad9f22084c1cf3e57a0362a6deee871181e6";
const RPC_GOERLI_URL = "https://ethereum-goerli.publicnode.com/";
const RPC_FANTOM_URL = "https://rpc.testnet.fantom.network";
const RPC_AVALANCE_URL = "https://api.avax-test.network/ext/bc/C/rpc";
const CHAIN_ID_FANTOM = 4002;
const CHAIN_ID_AVALANCE = 43113;

const ERC20ABI = [
    "function symbol() public view returns (string)",
    "function decimals() public view returns (uint8)",
    "function totalSupply() public view returns (uint256)",
    "function balanceOf(address _owner) public view returns (uint256 balance)",
    "function bridge(string calldata destinationChain, uint256 amount) external payable",
    "function approve(address spender, uint256 value) external returns (bool)",
];

const test = () => {
    return `Hello, Require! ${process.env.PRIVATE_KEY}`;
};

const getBalance = async (walletAddress, source) => {
    let ssttAddress = null;
    let rpcUrl = null;
    let chainId = null;

    if (source === "Fantom") {
        ssttAddress = SSTT_FANTOM;
        rpcUrl = RPC_FANTOM_URL;
        chainId = CHAIN_ID_FANTOM;
    } else if (source === "Avalance") {
        ssttAddress = SSTT_AVALANCE;
        rpcUrl = RPC_AVALANCE_URL;
        chainId = CHAIN_ID_AVALANCE;
    }
    
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const ssttContract = new ethers.Contract(ssttAddress, ERC20ABI, provider);
    const decimals = await ssttContract.decimals();
    const balance = await ssttContract.balanceOf(walletAddress);
    const res = formatUnits(balance, decimals)
    console.log("balance", res);
    return res;
};

const bridge = async (
    walletAddress = "0x439B1e41aBB213Ed475Bbf6A9c35ad6a2db3bc26",
    source = null,
    destination = null,
    amount = null
) => {
    let ssttAddress = null;
    let rpcUrl = null;
    let chainId = null;

    if (source === "Fantom") {
        ssttAddress = SSTT_FANTOM;
        rpcUrl = RPC_FANTOM_URL;
        chainId = CHAIN_ID_FANTOM;
    } else if (source === "Avalance") {
        ssttAddress = SSTT_AVALANCE;
        rpcUrl = RPC_AVALANCE_URL;
        chainId = CHAIN_ID_AVALANCE;
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const signer = new ethers.Wallet(
        process.env.PRIVATE_KEY,
        provider
    );

    const ssttContract = new ethers.Contract(ssttAddress, ERC20ABI, provider);

    const decimals = await ssttContract.decimals();

    const symbol = await ssttContract.symbol();

    // const estimatedGasLimit = await ssttContract.estimateGas.approve(
    //     walletAddress,
    //     "10000000000000000000"
    // );
    const approveTxUnsigned = await ssttContract.approve(walletAddress, amount);
    approveTxUnsigned.chainId = chainId; // chainId 1 for Ethereum mainnet
    approveTxUnsigned.gasLimit = 50000;
    approveTxUnsigned.gasPrice = await provider.getGasPrice();
    approveTxUnsigned.nonce = await provider.getTransactionCount(walletAddress);

    const bridge = await ssttContract.bridge(destination, amount);
    console.log(`Bridge: `, bridge);

    const approveTxSigned = await signer.signTransaction(approveTxUnsigned);
    const submittedTx = await provider.sendTransaction(approveTxSigned);

    const approveReceipt = await submittedTx.wait();
    if (approveReceipt.status === 0)
        throw new Error("Approve transaction failed");

    const totalSupply = await ssttContract.totalSupply();
    console.log(`${symbol} totalSupply : `, formatUnits(totalSupply, decimals));

    const balance = await ssttContract.balanceOf(walletAddress);
    console.log("balance", formatUnits(balance, decimals));
};

module.exports = { getBalance, bridge, test };
