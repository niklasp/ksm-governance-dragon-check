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
        <title>Can my dragon Grow? - Kusama Governance Rewards - Unofficial</title>
        <meta name="title" content="Can my dragon Grow? - Kusama Governance Rewards - Unofficial" />
        <meta name="description" content="Here you can check if you meet the requirements for your blue dragon to grow." />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://metatags.io/" />
        <meta property="og:title" content="Can my dragon Grow? - Kusama Governance Rewards - Unofficial" />
        <meta property="og:description" content="Here you can check if you meet the requirements for your blue dragon to grow." />
        <meta property="og:image" content="https://ksm-governance-dragon-check.vercel.app/meta.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://twitter.com/niftesty" />
        <meta property="twitter:title" content="Can my dragon Grow? - Kusama Governance Rewards - Unofficial" />
        <meta property="twitter:description" content="Here you can check if you meet the requirements for your blue dragon to grow." />
        <meta property="twitter:image" content="https://ksm-governance-dragon-check.vercel.app/meta.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        { false && <NFTInventory nfts={ govNfts } onCheck={ onCheck } /> }
        Currently under maintanance
      </main>

      <footer>
        This is no official app and we take no responsibility for the displayed results. You can <a href="https://github.com/niklasp/ksm-governance-dragon-check">check the code yourself at github.</a>
      </footer>
    </div>
  )
}

