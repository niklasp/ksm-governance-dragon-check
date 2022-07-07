import classnames from 'classnames';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { forEachLeadingCommentRange } from 'typescript';
import { fetchGovNftsForAddress } from '../lib/gov-nfts';

export default function NFTInventory ( { onCheck } ) {
  // const [ govNfts, setGovNfts ] = useState( {} );
  const [ willGrow, setWillGrow ] = useState( false );
  const [ KSMAddress, setKSMAddress ] = useState('');
  const [ filteredNfts, setFilteredNfts ] = useState([]);
  const [ error, setError ] = useState( '' );
  const [ counts, setCounts ] = useState( {
    epic: 0,
    rare: 0,
    common: 0,
  });

  let itemCount = 0;

  const { isLoading, error: queryError, data } = useQuery(
    ['nfts', KSMAddress ],
    () => fetchGovNftsForAddress( KSMAddress ),
    {
      enabled: KSMAddress.length === 47,
    }
  );

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

  const getErrorMsg = ( data ) => {
    if ( typeof data === 'undefined' ) {
      return 'error getting data';
    }
    if ( ! data.dragonCorrect ) {
      return 'You do not have the dragon equipped or not selected the correct dragon resource over the egg resource.'
    }
    const errorMsg = 'For your dragon to grow, ';
    const totalItems = data.common.length + data.rare.length + data.epic.length;
    if ( data.common.length < totalItems ) {
      errorMsg += `equip ${ 9 - data.common.length - data.rare.length - data.epic.length } more common items `
    }
    if ( data.rare.length < 1 ) {
      errorMsg += `equip ${ 1 - data.rare.length } more rare items `
    }
    if ( data.epic.length < 2 ) {
      errorMsg += `equip ${ 2 - data.epic.length } more epic items `
    }

    console.log( 'Error', errorMsg );

    return errorMsg;
  }

  function onAdressChange( e ) {
    setKSMAddress( e.target.value )
  }

  useEffect( () => {
    const wg =
      data?.epic.length + data?.rare.length + data?.common.length >= 9 &&
      data?.epic.length >= 2 &&
      data?.rare.length >= 1 &&
      data.dragonCorrect;

    setWillGrow( wg );
    setError( getErrorMsg( data ) );

    console.log( 'received', data );
  }, [ data ] )

  // useEffect( () => {
  //   setError( getErrorMsg() );
  // }, [ counts ] )

  return (
    <div className="nft-inventory">
      <h1>Kusama Governance Participation Rewards - Dragon</h1>
      <p className="fsmall">10 items are relevant <a href="https://twitter.com/GovPartRewKSM/status/1541046070184140801">for your dragon to grow (195-204)</a></p>
      <p className="fsmall">❗️ We currently do not check if you have the dragon equipped ❗️ (coming soon)</p>
      <p className="fsmall">Only items that are equipped to your shelf are checked.</p>
      <p className="fsmall">⏰ Snapshot will be taken 10th July 2022 1pm CET ⏰</p>
      <div className="pt enter">
        <input placeholder="enter your KSM address" minLength="47" maxLength="47" className="ksm-input" onChange={ onAdressChange }></input>
      </div>
      { isLoading && 'Loading...' }
      { queryError &&
        <div className="error">
          { queryError.status === 404 && 'No valid KSM address' }
          { queryError.status === 429 && 'API limit reached, try later' }
        </div>
      }
      { data && 
        <p>Dragon available and equipped correctly?
          { data?.dragonCorrect && <span className="success"> Yes</span>}
          { ! data?.dragonCorrect && <span className="error"> No</span>}
        </p>
      }
      { data?.common?.length && <>
        <p>
          You have { data.common.length + data.rare.length + data.epic.length }/10 items:
          <span className="epic"> { data.epic.length } epic </span>
          <span className="rare">{ data.rare.length } rare </span>
          <span className="common">{ data.common.length } common</span>
        </p>
        <div className={ resClasses }>
          { willGrow && data.dragonCorrect && <span>Congratulations, your dragon can grow.</span> }
          { ! willGrow && <span>{ error }</span> }
        </div>
      </> }
    </div>
  )
}