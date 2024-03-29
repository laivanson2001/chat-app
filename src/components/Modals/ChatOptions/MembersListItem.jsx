import React, { useState } from 'react';

import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  removeMember,
  removeUserRoomId,
  updateAdmin,
} from '../../../firebase/services';
import { toast } from 'react-toastify';

const MembersListItem = ({
  currentUserId,
  isCurUserAdmin,
  roomId,
  memberInfo,
  memberSelected,
  setMemberSelected,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleClick = () => {
    if (memberSelected == memberInfo?.uid) {
      setMemberSelected('');
      setShowOptions(false);
      return;
    }
    setMemberSelected(memberInfo?.uid);
    setShowOptions(true);
  };

  // roomId, memberInfo
  const handleUpdateAdmin = async () => {
    await updateAdmin(roomId, memberInfo);
    toast.success('Thêm quản trị viên thành công')
  };

  const handleRemoveMember = async () => {
    // Remove member out of group
    await removeMember(roomId, memberInfo);

    // Remove roomId of user in collection "users"
    await removeUserRoomId(memberInfo?.uid, roomId);
    toast.success(`Đã xóa ${memberInfo.displayName} ra khỏi nhóm`);
  };

  return (
    <li className="flex items-center gap-3">
      <img
        src={memberInfo?.photoURL}
        alt={memberInfo?.displayName}
        className="rounded-full aspect-square object-cover h-10"
      />
      <div className="flex flex-col justify-center flex-1">
        <p className="text-sm capitalize">{memberInfo?.displayName}</p>
        <span className="text-xs text-gray-400">
          {memberInfo?.isAdmin ? 'Quản trị viên' : 'Thành viên'}
        </span>
      </div>
      {isCurUserAdmin && memberInfo?.uid != currentUserId && (
        <div
          onClick={handleClick}
          className="relative flex-center rounded-full p-2 select-none cursor-pointer hover:bg-hoverLightMode dark:hover:bg-hover"
        >
          <FontAwesomeIcon className="text-xl" icon={faEllipsis} />
          {showOptions && memberSelected == memberInfo?.uid && (
            <ul
              onClick={(e) => e.stopPropagation()}
              className="z-10 absolute w-max rounded-md dark:bg-lightDarkMode bg-inputLightMode top-0 right-0 translate-y-[60%] py-1 px-2 select-none"
            >
              {!memberInfo?.isAdmin && (
                <li
                  onClick={handleUpdateAdmin}
                  className="duration-150 rounded p-1 px-2 dark:hover:bg-gray-600 hover:bg-slate-400"
                >
                  Thêm quản trị viên
                </li>
              )}
              <li
                onClick={handleRemoveMember}
                className="duration-150 rounded p-1 px-2 dark:hover:bg-gray-600 hover:bg-slate-400"
              >
                Xóa khỏi nhóm
              </li>
            </ul>
          )}
        </div>
      )}
    </li>
  );
};

export default MembersListItem;
