import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import React, { useMemo } from "react";
import { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
//Pages
import Election from "./pages/election";
import CreateElection from "./pages/createElection";
import Home from "./pages/home";
import Init from "./pages/transaction";
import Candidates from "./pages/candidates";
import Data from "./pages/data";
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
//Components
import NavbarMinimal from './components/header';
import { Grid } from '@mantine/core';

import './App.css';
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

// import the styles
require('@solana/wallet-adapter-react-ui/styles.css');

function App() {
  const [open, setOpen] = useState(false);
  const solNetwork = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(solNetwork), [solNetwork]);
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter()
    ],
    [solNetwork]
  );
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>
          <div className="App">
            <Router>
              <Grid>
                <Grid.Col span={1}>
                  <NavbarMinimal></NavbarMinimal>
                </Grid.Col>
                <Grid.Col span={11}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/create" element={<CreateElection />} />
                    <Route path="/election" element={<Election />} />
                    <Route path="/ballot" element={<Init />} />
                    <Route path="/actual" element={<Data />} />
                    <Route path="/candidates" element={<Candidates />} />
                  </Routes>
                </Grid.Col>
              </Grid>
            </Router>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;

