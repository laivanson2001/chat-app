import React from 'react';

import Sidebar from '../components/Sidebar';
import Content from '../components/Content';

const Home = () => {
  return (
    <div
      className="w-screen h-screen bg-lightMode dark:bg-darkMode dark:text-slate-100
      sm:flex-center p-4 gap-2 duration-200"
    >
      <Sidebar />
      <div className="hidden md:flex-center flex-1 h-full md:p-0 bg-lightMode dark:bg-darkMode">
        <div className="w-full flex-center text-xl md:text-2xl font-bold">
          Chọn cuộc trò chuyện để bắt đầu!
        </div>
      </div>
    </div>
  );
};

export default Home;
