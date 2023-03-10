import React, { useContext, useState } from 'react';

import Chat from './Chat';
import InfoChat from './InfoChat';
import { AppContext } from '../../context/AppProvider';
import InfoChatProvider from '../../context/InfoChatProvider';

const Content = () => {
  const { showConversation } = useContext(AppContext);

  return (
    <div
      className={`${
        !showConversation && 'hidden'
      } fixed inset-0 p-3 md:relative md:flex flex-1 h-full md:p-0 bg-lightMode dark:bg-darkMode`}
    >
      <InfoChatProvider>
        <Chat />
        <InfoChat />
      </InfoChatProvider>
    </div>
  );
};

export default Content;
