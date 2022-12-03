import clsx from 'clsx';
import type { FC } from 'react';
import Slug from "./Slug";

interface Props {
  sender: string;
  receiver: string;
  className?: string;
  color?: string;
}

const StreamPiece: FC<Props> = ({ sender, receiver, className = '', color = 'green' }) => {
  return (
    <div className="text-sm font-bold text-center my-1 flex justify-center">
        <Slug slug={sender} prefix="@" showBox className="text-lg"/>
        <img
          className="w-9 h-9 inline"
          height={35}
          width={35}
          src="https://app.superfluid.finance/gifs/stream-loop.gif"
          alt="stream"
          title="Streamin Friggin Mone"
          style={{ alignSelf: "center" }}
        />
        <Slug slug={receiver} prefix="@" showBox className="text-lg"/>
      </div>
  );
};

export default StreamPiece;
