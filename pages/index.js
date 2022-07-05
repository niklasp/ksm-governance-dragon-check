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
  const [ KSMAddress, setKSMAddress ] = useState('DT7kRjGFvRKxGSx5CPUCA1pazj6gzJ6Db11xmkX4yYSNK7m');
  const [ govNfts, setGovNfts ] = useState([]);

  function onAdressChange( e ) {
    setKSMAddress( e.target.value )
  }

  async function onCheck() {
    if ( KSMAddress !== '' ) {
      console.log( 'checking' );
      try {
        const nfts = await fetchGovNftsForWallet( KSMAddress )
        setGovNfts( nfts );

      } catch(e) {
        console.log( '123' );
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
        <NFTInventory nfts={ govNfts } onAdressChange={ onAdressChange } onCheck={ onCheck } />
      </main>

      <footer>
        This is no official app and we take no responsibility for the displayed results. You can check the code yourself at github.
      </footer>
    </div>
  )
}

