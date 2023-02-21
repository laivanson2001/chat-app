import React, { useContext } from 'react';

import { faCirclePlay } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AppContext } from '../../../../context/AppProvider';

const Vid = ({ handleUpload }) => {
  const { topicTheme } = useContext(AppContext);

  return (
    <label
      className="flex-center w-7 h-7 p-4 rounded-full hover:bg-hoverLightMode dark:hover:bg-hover cursor-pointer"
      htmlFor="fileVid"
    >
      <input
        onChange={(e) =>
          handleUpload(e.target.files[0], 'vids', 'video', 'Sent a video')
        }
        type="file"
        accept="video/*"
        id="fileVid"
        className="hidden"
      />
      <div className="flex-center">
        <FontAwesomeIcon
          style={{ color: topicTheme }}
          className="text-xl "
          icon={faCirclePlay}
        />
      </div>
    </label>
  );
};

export default Vid;
