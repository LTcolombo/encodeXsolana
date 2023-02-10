import { Connection, GetProgramAccountsFilter, Keypair, ParsedAccountData, PublicKey, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import secret from '../../guideSecret.json';
import { createAssociatedTokenAccount, createTransferInstruction, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { Metaplex, bundlrStorage, keypairIdentity, toBigNumber, toMetaplexFile } from "@metaplex-foundation/js";
import fs from 'fs'
import axios from "axios";



const QUICKNODE_RPC = 'https://nameless-restless-cherry.solana-devnet.discover.quiknode.pro/8b4b48463a9e4751d7896dc87696f3996b45f55f/';
const SOLANA_CONNECTION = new Connection(QUICKNODE_RPC);
const FROM_KEYPAIR = Keypair.fromSecretKey(new Uint8Array(secret));

const CHARS = [
    "Character_CyberPunk_Male_01",
    "Character_Junky_Female_01",
    "Character_Medical_Male_01",
    "Character_Monk_Male_01"
];


export default class SolanaAdapter {//} implements IDataAdapter {


    static _instance: SolanaAdapter;

    static Instance(): SolanaAdapter {
        if (!SolanaAdapter._instance)
            SolanaAdapter._instance = new SolanaAdapter();

        return SolanaAdapter._instance;
    }


    async transferNFT(to: string, mintAddress: string): Promise<boolean> {
        return await this.transferTokens(to, 1, mintAddress, true);
    }

    async transferCredits(to: string, amount: number): Promise<boolean> {
        const mintAddress = '6H7CS53VHp9XFeEs3d5LRtySb9m6junhj1sBcVTGZVys';
        return await this.transferTokens(to, amount, mintAddress);
    }

    async transferTokens(to: string, amount: number, mintAddress: string, forceCreate = false): Promise<boolean> {

        console.log(`Sending ${amount} ${(mintAddress)} from ${(FROM_KEYPAIR.publicKey.toString())} to ${(to)}.`)
        //Step 1
        console.log(`1 - Getting Source Token Account`);
        const sourceAccount = await getOrCreateAssociatedTokenAccount(
            SOLANA_CONNECTION,
            FROM_KEYPAIR,
            new PublicKey(mintAddress),
            FROM_KEYPAIR.publicKey
        );
        console.log(`    Source Account: ${sourceAccount.address.toString()}`);

        //Step 2
        console.log(`2 - Getting Destination Token Account`);

        let destinationAddress = null;

        if (forceCreate) {
            destinationAddress = await createAssociatedTokenAccount(
                SOLANA_CONNECTION,
                FROM_KEYPAIR,
                new PublicKey(mintAddress),
                new PublicKey(to)
            );
        } else {
            const destinationAccount = await getOrCreateAssociatedTokenAccount(
                SOLANA_CONNECTION,
                FROM_KEYPAIR,
                new PublicKey(mintAddress),
                FROM_KEYPAIR.publicKey
            );

            destinationAddress = destinationAccount.address;
        }
        console.log(`    Destination Account: ${destinationAddress.toString()}`);

        //Step 3
        console.log(`3 - Fetching Number of Decimals for Mint: ${mintAddress}`);
        const numberDecimals = await this.getNumberDecimals(mintAddress);
        console.log(`    Number of Decimals: ${numberDecimals}`);

        //Step 4
        console.log(`4 - Creating and Sending Transaction`);
        const tx = new Transaction();
        tx.add(createTransferInstruction(
            sourceAccount.address,
            destinationAddress,
            FROM_KEYPAIR.publicKey,
            amount * Math.pow(10, numberDecimals)
        ))

        const latestBlockHash = await SOLANA_CONNECTION.getLatestBlockhash('confirmed');

        console.log("latestBlockHash", latestBlockHash);

        tx.recentBlockhash = await latestBlockHash.blockhash;
        const signature = await sendAndConfirmTransaction(SOLANA_CONNECTION, tx, [FROM_KEYPAIR], { maxRetries: 10 });
        console.log(
            '\x1b[32m', //Green Text
            `   Transaction Success!🎉`,
            `\n    https://explorer.solana.com/tx/${signature}?cluster=devnet`
        );

        return true;
    }

    async getNumberDecimals(mintAddress: string): Promise<number> {
        const info = await SOLANA_CONNECTION.getParsedAccountInfo(new PublicKey(mintAddress));
        const result = (info.value?.data as ParsedAccountData).parsed.info.decimals as number;
        return result;
    }

    async mintAgentNFT(to: string, id: string = null): Promise<boolean> {

        if (id == null) {
            id = CHARS[Math.floor(Math.random() * CHARS.length)];
        }

        const METAPLEX = Metaplex.make(SOLANA_CONNECTION)
            .use(keypairIdentity(FROM_KEYPAIR))
            .use(bundlrStorage({
                address: 'https://devnet.bundlr.network',
                providerUrl: QUICKNODE_RPC,
                timeout: 60000,
            }));

        const imgBuffer = fs.readFileSync(`./img/${id}.png`);
        const imgMetaplexFile = toMetaplexFile(imgBuffer, id);

        const imgUri = await METAPLEX.storage().upload(imgMetaplexFile);
        console.log(`   Image URI:`, imgUri);


        const { uri } = await METAPLEX
            .nfts()
            .uploadMetadata({
                name: `${id}_${Math.round(Math.random() * 1000)}`,
                description: "Space Frontier Agent",
                image: imgUri,
                attributes: [{ trait_type: "prefab", value: id }],
                properties: {
                    files: [
                        {
                            type: 'image/png',
                            uri: imgUri,
                        },
                    ]
                }
            });

        const { nft } = await METAPLEX.nfts().create(
            {
                uri,
                name: `${id}_${Math.round(Math.random() * 1000)}`,
                sellerFeeBasisPoints: 0,
            },
            { commitment: "finalized" },
        );

        console.log(`   Success!🎉`);
        console.log(`   Minted NFT: https://explorer.solana.com/address/${nft.address}?cluster=devnet`);

        return await this.transferNFT(to, nft.address.toString());
    }

    async getTokenAccounts(wallet: string) {

//quick debug
        // return ["Character_CyberPunk_Male_01",
        // "Character_Junky_Female_01",
        // "Character_Medical_Male_01",
        // "Character_Monk_Male_01"];

        const METAPLEX = Metaplex.make(SOLANA_CONNECTION)
            .use(keypairIdentity(FROM_KEYPAIR))
            .use(bundlrStorage({
                address: 'https://devnet.bundlr.network',
                providerUrl: QUICKNODE_RPC,
                timeout: 60000,
            }));

        const filters: GetProgramAccountsFilter[] = [
            {
                dataSize: 165,    //size of account (bytes)
            },
            {
                memcmp: {
                    offset: 32,     //location of our query in the account (bytes)
                    bytes: wallet,  //our search criteria, a base58 encoded string
                }
            }
        ];

        const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
        const accounts = await SOLANA_CONNECTION.getParsedProgramAccounts(
            TOKEN_PROGRAM_ID,
            { filters: filters }
        );

        const res = [];

        for (const account of accounts) {
            //Parse the account data
            const parsedAccountInfo: any = account.account.data;
            const mintAddress: string = parsedAccountInfo["parsed"]["info"]["mint"];
            const tokenBalance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];

            console.log(parsedAccountInfo["parsed"]["info"]);

            if (tokenBalance > 0) {

                const onChainMeta = await METAPLEX.nfts().findByMint({ mintAddress: new PublicKey(mintAddress) });

                const tokenMetadata = await axios.get(onChainMeta.uri);

                if (tokenMetadata.data?.attributes) {
                    const prefabTrait = tokenMetadata.data.attributes.find(a => a.trait_type == "prefab");
                    if (prefabTrait)
                        //todo cache in redis
                        res.push(prefabTrait.value);
                }
            }
        }

        return res;
    }
}
