import classnames from 'classnames';
import { useEffect, useState } from 'react';
import { forEachLeadingCommentRange } from 'typescript';

export default function NFTInventory ( { nfts, onCheck } ) {
  const [ willGrow, setWillGrow ] = useState( false );
  const [ KSMAddress, setKSMAddress ] = useState('');
  const [ filteredNfts, setFilteredNfts ] = useState([]);
  const [ error, setError ] = useState( '' );
  const [ counts, setCounts ] = useState( {
    epic: 0,
    rare: 0,
    common: 0,
  });

  //id: [ common, rare, epic ]
  const govIds = {
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

  const resClasses = classnames({
    'result': true,
    'success': willGrow,
    'error': ! willGrow,
  });

  const getErrorMsg = () => {
    const errorMsg = 'For your dragon to grow, ';
    const totalItems = counts.common + counts.rare + counts.epic;
    if ( counts.common < totalItems ) {
      errorMsg += `you need ${ 9 - counts.common - counts.rare - counts.epic } more common items `
    }
    if ( counts.rare < 1 ) {
      errorMsg += `you need ${ 1 - counts.rare } more rare items `
    }
    if ( counts.epic < 2 ) {
      errorMsg += `you need ${ 2 - counts.epic } more epic items `
    }

    return errorMsg;
  }

  useEffect( () => {
    if ( ! nfts.length ) {
      return;
    }

    const nftCounts = {
      epic: 0,
      rare: 0,
      common: 0,
    }

    const filtered = nfts.filter(nft=> {
      const refId = nft.equipped.slice(-3);
      console.log( 'ref', refId );
      return nft.equipped !== '' && 195 <= parseInt( refId ) && 204 >= parseInt( refId );
    })

    setFilteredNfts( filtered );

    console.log( 'Filtered', filtered );

    filtered.forEach(nft => {
      const refId = nft.equipped.slice(-3);
      if ( typeof refId !== 'undefined' && typeof govIds[ refId ] !== 'undefined' ) {
        if ( nft.id.includes( govIds[ refId ][ 2 ] ) ) {
          nftCounts.epic += 1;
        }
        if ( nft.id.includes( govIds[ refId ][ 1 ] ) ) {
          nftCounts.rare += 1;
        }
        if ( nft.id.includes(  govIds[ refId ][ 0 ] ) ) {
          nftCounts.common += 1;
        }
      }

      setCounts( nftCounts );
      const wg =
        nftCounts.epic + nftCounts.rare + nftCounts.common >= 9 &&
        nftCounts.epic >= 2 &&
        nftCounts.rare >= 1

      setWillGrow( wg );

    });
  }, [ nfts ]);

  function onAdressChange( e ) {
    setKSMAddress( e.target.value )
  }

  useEffect( () => {
    setError( getErrorMsg() );
  }, [ counts ] )

  return (
    <div className="nft-inventory">
      <h1>Kusama Governance Participation Rewards - Dragon</h1>
      <p className="fsmall">10 items are relevant <a href="https://twitter.com/GovPartRewKSM/status/1541046070184140801">for your dragon to grow (195-204)</a></p>
      <p className="fsmall">Only items that are equipped to your shelf are checked.</p>
      <p className="fsmall">⏰ Snapshot will be taken 10th July 2022 1pm CET ⏰</p>
      <div>enter your ksm address <input className="ksm-input" onChange={ onAdressChange }></input><button onClick={ () => onCheck( KSMAddress ) }>check</button></div>
      { nfts.length !== 0 && <>
        <p>You have { filteredNfts.length } items: <span className="epic">{counts.epic} epic</span> <span className="rare">{counts.rare} rare</span> <span className="common">{counts.common} common</span></p>
        <div className={ resClasses }>
          { willGrow && <span>Congratulations, your dragon can grow.</span> }
          { ! willGrow && <span>{ error }</span> }
        </div>
      </> }
      { nfts.length === 0 && KSMAddress !== '' && <div class="error">address not found or error getting shelf nfts</div> }
    </div>
  )
}