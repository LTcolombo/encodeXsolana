# encodeXsolana
Space Frontier Game

# Idea
The game is meant to be a mix of classic RPG games and a city builder mechanics.
The RPG part is built around NPCs which are player owned NFTs, minted during gameplay.
The players role is to manage a small settlement and optimise, expand and maintain it, so that it can thrive and eventually allow to yield some rewards in a form of FT.
The asset generation (either new buildings or opportunities for imprivement) are generated by the server in a form of quests (currently implemented as simple dialogues).

# Tech
## Client
Client is built using Unity as a webGL build.
- this allows hassle-free connection to most wallets
- since the build size is relatively small (just over 15mb) it allows to start playing within seconds after clicking the link (no istalls etc).

## Backend
Typescript NodeJS. 

main functions:
- wraps blockchain API.
- manages FT withdrawal
- generates NPC NFTs
- controls any asset generation mechanics. (e.g. game quest which might produce some value are entirely controlled by backend)

src/controllers contains the logic, 
src/data has both offchain and solana adapters.