mergeInto(LibraryManager.library, {
    SignIn: async function()
    {
        const getProvider = () => {
          if ('phantom' in window && window.phantom != undefined) {
            const provider = window.phantom.solana;
        
            if (provider != null && provider.isPhantom) {
              return provider;
            }
          }
        
          window.open('https://phantom.app/', '_blank');
        };
        
        const provider = getProvider(); // see "Detecting the Provider"
        try {
            const resp = await provider.connect();
            console.log(resp.publicKey.toString());
            SendMessage("Bootstrap", "HandleWalletId", resp.publicKey.toString());
        } catch (err) {
            // { code: 4001, message: 'User rejected the request.' }
        }
    }
});