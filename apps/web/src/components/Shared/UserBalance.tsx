import { FC, ReactElement, useEffect, useMemo, useState } from "react";
import FlowingBalance from "./FlowingBalance";
import { useContractReads } from 'wagmi'
import { CFA, SUPERFLUID_FORWARDER } from 'data/constants';
import { SuperfluidForwarder, SuperToken } from 'abis';

export interface UserBalanceProps {
  account: string;
  /**
   * Timestamp in Subgraph's UTC.
   */
  token: string;
}

const UserBalance: FC<UserBalanceProps> = ({
  account, token
}): ReactElement => {
  
   
  const tokenContract = {
    address: token,
    abi: SuperToken,
  }
  const forwarderContract = {
    address: SUPERFLUID_FORWARDER,
    abi: SuperfluidForwarder,
  }

  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...tokenContract,
        functionName: 'balanceOf',
        args: [account]
      },
      {
        ...forwarderContract,
        functionName: 'getAccountFlowrate',
        args: [token, account]
      },
    ],
  });
  
  const currentTimestamp = Number(((new Date().valueOf())/1000).toFixed(0));
  
  // use the wagmi thing to get balance + netflow
  // use current timestamp at time of request
  // feed it in 


  return (
    <FlowingBalance
      balance={data?.[0]}
      balanceTimestamp={currentTimestamp}
      flowRate={data?.[1]}
    />
  );
};

export default UserBalance;