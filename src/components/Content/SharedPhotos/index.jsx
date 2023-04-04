import React, { useState } from 'react';

import SPcontent from './SPcontent';

const SharedPhotos = ({ onShowMediaModal, sharedPhotoData }) => {
  const [show, setShow] = useState(false);

  const handleClick = () => {
    setShow(!show);
  };

  return (
    <div className="flex flex-col my-3">
      <div className="flex items-center justify-between">
        <div
          onClick={handleClick}
          className="font-bold p-2 rounded-md cursor-pointer hover:bg-hoverLightMode dark:hover:bg-hover"
        >
          Ảnh chia sẻ
        </div>
        <div
          onClick={onShowMediaModal}
          className="flex-center p-2 rounded-md cursor-pointer hover:bg-hoverLightMode dark:hover:bg-hover"
        >
          Tất cả
        </div>
      </div>

      <SPcontent data={sharedPhotoData} show={show} />
    </div>
  );
};

export default SharedPhotos;
