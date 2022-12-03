import clsx from 'clsx';
import type { FC } from 'react';
import UserBalance from "./UserBalance";

interface Props {
  isSubscribed: boolean;
  flowRate: string;
  account: string;
  tokenAddress: string;
  tokenName: string;
}

const BalancePiece: FC<Props> = ({ isSubscribed, flowRate, account, tokenName, tokenAddress }) => {
  return (
    <div>
      <div>
        <span className="font-boldest">{isSubscribed ? "Streaming" : "Stream:" }: </span>
        <span className="space-x-1">
          <span className="text-lg font-bold">{flowRate} {tokenName}</span>
          <span className="text-xs">/ month</span>
        </span>
      </div>
      {
        isSubscribed && 
        (
          <div>
            <span className="">Balance: </span>
            <UserBalance account={account} token={tokenAddress} className="font-bold"/>
            <span className="text-xs"> {tokenName} </span>
          </div>
        )
      }
    </div>
  );
};

export default BalancePiece;
