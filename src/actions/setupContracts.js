import { abi, settings } from '../constants/contracts';

/**
 * Connect LOW smart contracts.
 * @param {*} state
 * @async
 * @returns object Game contract objects.
 */
export async function setupGameContracts(state) {
  const { web3 } = state;
  const Contract = web3.eth.Contract;
  const Lair = new Contract(abi.Lair, settings.fantom.Lair.address);

  const dragonAddrs = await Lair.methods.allDragons().call();
  const Dragons = dragonAddrs.map(address => (new Contract(abi.Dragon, address)));
  
  const eggAddrs = await Lair.methods.allEggs().call();
  const Eggs = eggAddrs.map(address => (new Contract(abi.Egg, address)));

  return { Lair, Dragons, Eggs };
}

/**
 * Takes Account state and Dispatch function to link smart contracts.
 * @param {*} state 
 * @param {*} dispatch
 */
export default async function setupContracts(state, dispatch) {
  const { web3 } = state;
  if (!web3) return;

  try {
    const { Lair, Dragons, Eggs } = await setupGameContracts(state);
    dispatch(st => {
      st.contracts = { Lair, Dragons, Eggs };
      return { ...st };
    });
  } catch (err) {
    console.log(err)
    // TODO: Add contract failure error handling.
  }
}