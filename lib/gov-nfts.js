const GOV_ITEM_SHELF_COLLECTION_ID = '3208723ec6f65df810-SHELF';

const GOV_ITEM_COLLECTION_IDS = [
  '3208723ec6f65df810-ITEMXPUNKS',
  '3208723ec6f65df810-ITEM',
];

const fetchGovNftsForWallet = async ( ksmAddress ) => {
  const endpoint = `http://138.68.123.124/get_nfts_owned_by/${ ksmAddress }`;
  const res = await fetch( endpoint );
  const userNfts = await res.json();

  if ( ! userNfts.length ) {
    return Promise.reject(new Error(400));
  }

  console.log( 'got ', userNfts.length, ' nfts ');

  const ret = [];

  console.log( 'ret', ret )

  const shelf = userNfts.find(
    nft => nft.collection === GOV_ITEM_SHELF_COLLECTION_ID
  );

  console.log( 'shelftype', typeof shelf, shelf );
  const { id: shelfId } = shelf;
  if ( typeof shelf !== 'undefined' ) {
    console.log( 'user has shelf, getting shelf nfts for id', shelfId );
    const nft_endpoint = `http://138.68.123.124/get_nft_by_id/${ shelfId }`;
    const nft_res = await fetch( nft_endpoint );
    const shelfItem = await nft_res.json();
    const shelfChildren = shelfItem.children;
    ret.push( ...shelfChildren );
  }

  return ret;
};

export {
  fetchGovNftsForWallet
}