import { FC, ReactElement, useEffect, useMemo, useState } from "react";
import { BigNumberish, ethers } from "ethers";
import Decimal from "decimal.js";

const ANIMATION_MINIMUM_STEP_TIME = 80;

const EtherFormatted: FC<{ wei: BigNumberish }> = ({ wei }) => {
  const etherDecimalPlaces = 6

  if (wei == undefined) {
    return "0"; // No need to show animation when flow rate is zero.
  }

  const ether = ethers.utils.formatEther(wei);
  const isRounded = ether.split(".")[1].length > etherDecimalPlaces;
  const finalValue = new Decimal(ether).toDP(etherDecimalPlaces).toFixed();
  return <>{isRounded && "~"}{finalValue}{(finalValue*100000%1==0) && "0"}</>;
};

export interface FlowingBalanceProps {
  balance: string;
  /**
   * Timestamp in Subgraph's UTC.
   */
  balanceTimestamp: number;
  flowRate: string;
  className?: string;
}

const FlowingBalance: FC<FlowingBalanceProps> = ({
  balance,
  balanceTimestamp,
  flowRate,
  className = ""
}): ReactElement => {
  const [weiValue, setWeiValue] = useState<BigNumberish>(balance);
  useEffect(() => setWeiValue(balance), [balance]);

  const balanceTimestampMs = useMemo(
    () => ethers.BigNumber.from(balanceTimestamp).mul(1000),
    [balanceTimestamp]
  );

  useEffect(() => {
    if(flowRate == undefined) return;
    const flowRateBigNumber = ethers.BigNumber.from(flowRate);
    if (flowRateBigNumber.isZero()) {
      return; // No need to show animation when flow rate is zero.
    }

    const balanceBigNumber = ethers.BigNumber.from(balance);

    let stopAnimation = false;
    let lastAnimationTimestamp: DOMHighResTimeStamp = 0;

    const animationStep = (currentAnimationTimestamp: DOMHighResTimeStamp) => {
      if (stopAnimation) {
        return;
      }

      if (
        currentAnimationTimestamp - lastAnimationTimestamp >
        ANIMATION_MINIMUM_STEP_TIME
      ) {
        const currentTimestampBigNumber = ethers.BigNumber.from(
          new Date().valueOf() // Milliseconds elapsed since UTC epoch, disregards timezone.
        );

        const nextStep = 
            currentTimestampBigNumber
              .sub(balanceTimestampMs)
              .mul(flowRateBigNumber)
              .div(1000);
        
        setWeiValue(
          balanceBigNumber.add(nextStep));

        lastAnimationTimestamp = currentAnimationTimestamp;
      }

      window.requestAnimationFrame(animationStep);
    };

    window.requestAnimationFrame(animationStep);

    return () => {
      stopAnimation = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balance, balanceTimestamp, flowRate]);

  if(weiValue !== undefined) {
    return (
      (<span
        style={{
          textOverflow: "ellipsis",
          fontVariantNumeric: "tabular-nums"
        }}
        className={className}
      >
        <EtherFormatted wei={weiValue} />
      </span>)
    );
  }
};

export default FlowingBalance;