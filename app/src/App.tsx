import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import React from "react";
import { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { wallets } from "./config/web3";
//Pages
import Election from "./pages/election";
import CreateElection from "./pages/createElection";
import Home from "./pages/home";
import Init from "./pages/transaction";
import Candidates from "./pages/candidates";
import Data from "./pages/data";
//Componenets
import NavbarMinimal from './components/header';
import { Grid } from '@mantine/core';

function App() {
  const [open, setOpen] = useState(false);
  return (
    <ConnectionProvider endpoint={clusterApiUrl("devnet")}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Grid>
            <Grid.Col span={1}>
              <NavbarMinimal></NavbarMinimal>
            </Grid.Col>
            <Grid.Col span={11}>
              <Router>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/create" element={<CreateElection />} />
                  <Route path="/election" element={<Election />} />
                  <Route path="/ballot" element={<Init />} />
                  <Route path="/actual" element={<Data />} />
                  <Route path="/candidates" element={<Candidates />} />
                </Routes>
              </Router>
            </Grid.Col>
          </Grid>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;

