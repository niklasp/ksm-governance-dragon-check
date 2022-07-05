import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import Head from 'next/head'
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";
import { useEffect, useState } from 'react';
import NFTInventory from '../components/NFTInventory';
import { fetchGovNftsForWallet } from '../lib/gov-nfts';

export default function Home() {
  
  const [ govNfts, setGovNfts ] = useState([]);

  async function onCheck( KSMAddress ) {
    console.log( 'checking ksm address', KSMAddress );
    if ( KSMAddress !== '' ) {
      console.log( 'checking' );
      try {
        const nfts = await fetchGovNftsForWallet( KSMAddress )
        setGovNfts( nfts );
      } catch(e) {
        setGovNfts([]);
      }
    }
  }

  return (
    <div className="container">
      <Head>
        <title>Dragon Grow Checker - Kusama Governance Rewards</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <NFTInventory nfts={ govNfts } onCheck={ onCheck } />
      </main>

      <footer>
        This is no official app and we take no responsibility for the displayed results. You can <a href="https://github.com/niklasp/ksm-governance-dragon-check">check the code yourself at github.</a>
      </footer>
    </div>
  )
}

