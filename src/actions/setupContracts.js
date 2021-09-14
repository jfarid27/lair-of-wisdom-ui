import { abi, settings } from '../constants/contracts';

export default async function setupContracts(state, dispatch) {

  const { web3 } = state;
  if (!web3) return;

  try {
    const Contract = web3.eth.Contract;
    const Lair = new Contract(abi.Lair, settings.fantom.Lair.address);

    const dragonAddrs = await Lair.methods.allDragons().call();
    const eggAddrs = await Lair.methods.allEggs().call();

    const Dragons = dragonAddrs.map(address => (new Contract(abi.Dragon, address)));
    const Eggs = eggAddrs.map(address => (new Contract(abi.Egg, address)));

    dispatch(st => {
      st.contracts = { Lair, Dragons, Eggs };
      debugger
      return st;
    });
  } catch (err) {
    // TODO: Add contract failure error handling.
    return {}
  }
}