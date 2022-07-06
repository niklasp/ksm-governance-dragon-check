const GOV_ITEM_SHELF_COLLECTION_ID = '3208723ec6f65df810-SHELF';
const GOV_DRAGON_ID = 'ITEM-192EGG'
//<referendum_id>: [ common, rare, epic ]
const GOV_NFT_IDS = {
  195: [ '195BBIRD', '195BRBIRD', '195RBIRD' ],
  196: [ '196SPTEL', '196CBSW', '196TPOLE' ],
  197: [ '197COIN', '197MBAG', '197CHEST' ],
  198: [ '198SF', '198STF', '198BF' ],
  199: [ '199SN', '199PN', '199MPN' ],
  200: [ '200DB', '200CHOP', '200FB' ],
  201: [ '201SJ', '201SB', '201SSC' ],
  202: [ '202BALL', '202RING', '202FLGO' ],
  203: [ '203HS', '203CLVR', '203LCAT' ],
  204: [ '204RL', '204JL', '204PB' ],
  // 205: [ 'ITEM-205SW', '205SP', '205SG' ],
}

const fetchGovNftsForAddress = async ( ksmAddress ) => {
  const endpoint = `http://138.68.123.124/get_nfts_owned_by/${ ksmAddress }`;
  const res = await fetch( endpoint, { referrerPolicy: 'no-referrer-when-downgrade' } )

  if (!res.ok) {
    return Promise.reject( res )
  }

  let result = {
    dragonCorrect: false,
    common: [],
    rare: [],
    epic: [],
  }

  const jsonData = await res.json()

  if ( jsonData.length === 0 ) {
    return Promise.reject( new Response( 'nothing here', {
      ...res.options,
      status: 404,
    } ) )
  }

  const shelf = jsonData.find(
    nft => nft.collection === GOV_ITEM_SHELF_COLLECTION_ID
  )
  if ( typeof shelf !== 'undefined' ) {
    console.log( 'user has shelf, getting shelf nfts for id', shelf.id );
    const shelfItem = await fetchNftById( shelf.id );
    const shelfChildren = shelfItem.children;
    
    //get the dragon nft
    const dragonNft = shelfChildren.find( nft => {
      const refId = nft.equipped.slice(-3);
      return refId === '192';
    })

    if ( typeof dragonNft !== 'undefined' ) {
      const dragonItem = await fetchNftById( dragonNft.id );
      console.log( 'DRAGON', dragonItem );
    }
    
    const relevantNfts = shelfChildren.filter( nft => {
      const refId = nft.equipped.slice(-3);
      return nft.equipped !== '' && 195 <= parseInt( refId ) && 204 >= parseInt( refId );
    })
    relevantNfts.forEach( nft => {
      const refId = nft.equipped.slice(-3);
      const nftData = { ref: refId, id:nft.id }

      if ( nft.id.includes( GOV_NFT_IDS[ refId ][ 2 ] ) ) {
        result.epic.push( nftData );
      }
      if ( nft.id.includes( GOV_NFT_IDS[ refId ][ 1 ] ) ) {
        result.rare.push( nftData );
      }
      if ( nft.id.includes( GOV_NFT_IDS[ refId ][ 0 ] ) ) {
        result.common.push( nftData );
      }
    })
  }

  return Promise.resolve( result );
}

const fetchNftById = async ( id ) => {
  const endpoint = `https://api.allorigins.win/raw?url=http://138.68.123.124/get_nft_by_id/${ id }`
  const response = await fetch( endpoint, { referrerPolicy: 'no-referrer-when-downgrade' } )
  if (!response.ok) {
    return Promise.reject(response)
  }
  return response.json()
}

const fetchGovNftsForWallet = async ( ksmAddress ) => {
  const endpoint = `https://api.allorigins.win/raw?url=http://138.68.123.124/get_nfts_owned_by/${ ksmAddress }`;
  const res = await fetch( endpoint, { referrerPolicy: 'no-referrer-when-downgrade' } );
  const userNfts = await res.json();

  console.log('res', res.status );
  // if ( !) {
  //   return Promise.reject(new Error(429));
  // }

  if ( ! userNfts.length ) {
    return Promise.reject(new Error(400));
  }

  const ret = [];

  const shelf = userNfts.find(
    nft => nft.collection === GOV_ITEM_SHELF_COLLECTION_ID
  );

  const { id: shelfId } = shelf;
  if ( typeof shelf !== 'undefined' ) {
    console.log( 'user has shelf, getting shelf nfts for id', shelfId );
    const nft_endpoint = `https://api.allorigins.win/raw?url=http://138.68.123.124/get_nft_by_id/${ shelfId }`;
    const nft_res = await fetch( nft_endpoint );
    const shelfItem = await nft_res.json();
    const shelfChildren = shelfItem.children;
    ret.push( ...shelfChildren );
  }

  return ret;
};

export {
  fetchGovNftsForWallet,
  fetchNftById,
  fetchGovNftsForAddress
}