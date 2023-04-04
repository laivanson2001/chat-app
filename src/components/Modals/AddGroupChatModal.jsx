import React, { useContext, useEffect, useState } from 'react';
import { faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ModalsTemplate from './ModalsTemplate';
import { AuthContext } from '../../context/AuthContext';
import {
  createNewRoom,
  getUser,
  updateUserRooms,
} from '../../firebase/services';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../reducers/actions';
import { toast } from 'react-toastify';

const AddGroupChatModal = () => {
  const { currentUser } = useContext(AuthContext);
  const [inputRoomName, setInputRoomName] = useState('');
  const [members, setMembers] = useState([]);
  const [friendIdInput, setFriendIdInput] = useState('');
  const [notification, setNotification] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    setMembers([
      {
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        uid: currentUser.uid,
        isAdmin: true,
      },
    ]);
  }, []);

  const handleRemoveMember = (id) => {
    const newArrMember = [...members];
    newArrMember.splice(id, 1);
    setMembers(newArrMember);
  };

  const handleAddMember = async (uid) => {
    if (uid.trim() === '') {
      setFriendIdInput('');
      setNotification('Vui lòng nhập đủ thông tin!');
      return;
    }
    const res = await getUser(uid);
    if (!res.size) {
      setFriendIdInput('');
      setNotification("Người dùng không tồn tại!");
      return;
    }
    if (members.length > 10) {
      setNotification('Vượt quá số lượng thành viên!');
      return;
    }
    const isAdded = members.some((mem) => mem.uid == uid);
    if (isAdded) {
      setFriendIdInput('');
      setNotification('Thành viên đã có trong nhóm!');
      return;
    }
    res.forEach((doc) =>
      setMembers((prev) => [
        ...prev,
        {
          displayName: doc.data().displayName,
          photoURL: doc.data().photoURL,
          uid: doc.data().uid,
          isAdmin: false,
        },
      ]),
    );
    setFriendIdInput('');
    setNotification('');
  };

  const handleCreateGroupChat = async (e) => {
    e.preventDefault();
    if (members.length < 2) {
      setNotification('Cần ít nhất 2 thành viên để tạo nhóm!');
      return;
    }

    const res = await createNewRoom(inputRoomName, members, 'group');
    toast.success('Tạo nhóm chat thành công')
    members.forEach(async (member) => {
      const { uid } = member;
      const user = await getUser(uid);
      // After created room => add the id room to all the user
      user.forEach((doc) => updateUserRooms(doc.id, res.id));
    });
    setInputRoomName('');
    dispatch(closeModal());
  };

  return (
    <ModalsTemplate>
      <div className="flex-center bg-lightMode dark:bg-darkMode rounded-lg px-3 py-5">
        <form onSubmit={handleCreateGroupChat} className="py-3 px-5">
          <div className="flex flex-col mb-5">
            <div className="font-bold mb-2">Tên nhóm: </div>
            <input
              value={inputRoomName}
              onChange={(e) => setInputRoomName(e.target.value)}
              required
              className="input-styled-chat rounded-xl px-4 py-2"
              placeholder="Nhập tên nhóm"
            />
          </div>
          <div className="flex flex-col">
            <div className="font-bold mb-2">Thành viên ID: </div>
            <div className="flex-center justify-start gap-2">
              <input
                value={friendIdInput}
                onChange={(e) => setFriendIdInput(e.target.value)}
                className="md:w-60 input-styled-chat rounded-xl px-4 py-2"
                placeholder="Nhập ID..."
              />
              <div
                onClick={() => handleAddMember(friendIdInput)}
                className="modal-btn bg-emerald-600"
              >
                Thêm
              </div>
            </div>
          </div>

          <span className="flex font-bold text-rose-600 opacity-85 my-2">
            <i>{notification}</i>
          </span>

          {/* List member */}
          <ul className="max-w-[350px] md:max-w-[450px] lg:max-w-[600px] flex items-center flex-wrap gap-2">
            {members.map((member, index) => (
              <li
                key={member?.uid ?? index}
                className="w-12 h-12 aspect-square relative"
              >
                <img
                  className="w-full h-full rounded-full object-cover"
                  src={member?.photoURL}
                />
                {index != 0 && (
                  <div
                    onClick={() => handleRemoveMember(index)}
                    className="flex-center absolute -top-1 -right-1 p-0.5 bg-gray-500 text-sm rounded-full cursor-pointer"
                  >
                    <FontAwesomeIcon className="text-xl" icon={faXmarkCircle} />
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Options Control */}
          <div className="flex-center justify-end mt-10 gap-4">
            <button type="submit" className="modal-btn bg-cyan-600 min-w-full">
              Tạo nhóm
            </button>
          </div>
        </form>
      </div>
    </ModalsTemplate>
  );
};

export default AddGroupChatModal;
