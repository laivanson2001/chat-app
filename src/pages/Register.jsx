import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// firebase
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { auth, storage } from '../firebase/config';

import { faImage } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createNewUser } from '../firebase/services';
import { toast } from 'react-toastify';

const Register = () => {
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      if (!file) {
        setError(true);
        return;
      }
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const storageRef = ref(storage, `/avatar/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => snapshot,
        (error) => {
          setError(true);
          console.log(error);
          toast.error('Lỗi')
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            // Update Authentication
            console.log(downloadURL);
            await updateProfile(res.user, {
              displayName: displayName,
              photoURL: downloadURL,
            });

            // Add Document account to collection 'users'
            await createNewUser(displayName, email, downloadURL, res.user.uid);
            toast.success('Đăng ký tài khoản thành công')
            navigate('/');
          });
        },
      );
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="w-screen h-screen flex-center flex-wrap bg-white">
      <div
        className="flex-center flex-col gap-2 rounded-xl 
         px-10 py-3 sm:px-14 sm:py-5 w-[450px]"
      >
        <span className="sm:text-[32px] font-bold font-rubikWet text-2xl logo-text mb-5">
          Atomic Chat
        </span>
        <form
          onSubmit={handleSubmit}
          className="w-full flex-center flex-col gap-[10px]"
        >
          <input
            required
            className="input-styled input-login border-b-0 rounded-2xl"
            type="text"
            placeholder="Họ tên"
          />
          <input
            required
            className="input-styled input-login border-b-0 rounded-2xl"
            type="email"
            placeholder="Email"
          />
          <input
            required
            className="input-styled input-login border-b-0 rounded-2xl"
            type="password"
            placeholder="Mật khẩu"
          />
          <input style={{ display: 'none' }} type="file" id="file" />
          <label
            className="input-styled flex-center justify-start gap-[10px] 
            cursor-pointer border-none font-[14px] p-[15px] input-login border-b-0 rounded-2xl"
            htmlFor="file"
          >
            <FontAwesomeIcon
              icon={faImage}
              className="icon-add-file text-2xl"
            />
            <span className="">Thêm ảnh đại diện</span>
          </label>
          <button className="w-full button-styled button-login rounded-3xl mt-2">Đăng ký</button>
        </form>
        {error && <p className="font-bold text-xl text-red-500">Vui lòng chọn ảnh!</p>}
        <p>
          Bạn đã có tài khoản?{' '}
          <Link to="/login" className="font-bold text-bg-messages">
            <u>Đăng nhập</u>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
