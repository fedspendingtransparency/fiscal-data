import React, { ReactElement, SyntheticEvent } from 'react';
import { FunctionComponent } from 'react';
import { useSetRecoilState } from 'recoil';
import { redirectModalState } from '../modal/redirect-modal/redirect-modal-helper';

interface ISocialShareWrapper {
  children: ReactElement;
}

export const SocialShareWrapper: FunctionComponent<ISocialShareWrapper> = ({ children }) => {
  const setModal = useSetRecoilState(redirectModalState);

  const openModal = (e: SyntheticEvent, url: string) => {
    e.preventDefault();
    // onClick?.();
    setModal({
      open: true,
      url,
      after: () => {
        window.open(url, '_blank', 'noreferrer, noopener, width=650,height=600');
      },
    });
  };

  const handleClick = e => {
    e.preventDefault();
  };

  return <></>;
};
