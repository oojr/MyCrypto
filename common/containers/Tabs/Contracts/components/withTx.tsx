import * as configSelectors from 'selectors/config';
import { AppState } from 'reducers';
import { toWei, Wei, getDecimal } from 'libs/units';
import { connect } from 'react-redux';
import { showNotification, TShowNotification } from 'actions/notifications';
import { broadcastTx, TBroadcastTx } from 'actions/wallet';
import { IFullWallet, Balance } from 'libs/wallet';
import { RPCNode } from 'libs/nodes';
import { NodeConfig, NetworkConfig } from 'config/data';

export interface IWithTx {
  wallet: IFullWallet;
  balance: Balance;
  node: NodeConfig;
  nodeLib: RPCNode;
  chainId: NetworkConfig['chainId'];
  networkName: NetworkConfig['name'];
  gasPrice: Wei;
  broadcastTx: TBroadcastTx;
  showNotification: TShowNotification;
}

const mapStateToProps = (state: AppState) => {
  const network = configSelectors.getNetworkConfig(state);
  return {
    wallet: state.wallet.inst,
    balance: state.wallet.balance,
    node: configSelectors.getNodeConfig(state),
    nodeLib: configSelectors.getNodeLib(state),
    chainId: network ? network.chainId : 0,
    networkName: network ? network.name : 'Unknown network',
    gasPrice: toWei(
      `${configSelectors.getGasPriceGwei(state)}`,
      getDecimal('gwei')
    )
  };
};

export const withTx = passedComponent =>
  connect(mapStateToProps, {
    showNotification,
    broadcastTx
  })(passedComponent);
