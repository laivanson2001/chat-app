import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// firebase
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../firebase/config';

import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createNewUser, getUser } from '../firebase/services';
import { toast } from 'react-toastify';

const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/');
      } else {
        navigate('/login');
      }
    });

    return () => {
      unsub();
    };
  }, []);

  const handleSubmitEmailAndPassword = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Đăng nhập thành công')
      navigate('/');
    } catch (err) {
      setErr(true);
    }
  };

  const checkUser = async (user) => {
    try {
      const result = await getUser(user.uid);
      if (result.size === 0) {
        // displayName, email, photoURL, uid
        await createNewUser(
          user.displayName,
          user.email,
          user.photoURL,
          user.uid,
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogin = async (provider) => {
    try {
      const { user } = await signInWithPopup(auth, provider);
      await checkUser(user);
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-screen h-screen flex-center flex-wrap bg-white">
      <div
        className="flex-center flex-col gap-2 rounded-xl  px-10 py-3
      sm:px-14 sm:py-5 w-[450px]"
      >
        <span className="sm:text-[40px] font-bold font-rubikWet text-2xl logo-text mb-5">
          Atomic Chat
        </span>
        <form
          onSubmit={handleSubmitEmailAndPassword}
          className="w-full flex-center flex-col gap-[10px]"
        >
          <input
            className="input-styled input-login border-b-0 rounded-2xl"
            type="email"
            placeholder="Email"
          />
          <input
            className="input-styled input-login border-b-0 rounded-2xl"
            type="password"
            placeholder="Mật khẩu"
          />
          {err && (
            <i className="font-bold text-xl my-2">Lỗi!</i>
          )}
          <button type="submit" className="w-full button-styled button-login rounded-3xl mt-2">
            Đăng nhập
          </button>
        </form>
        <p>--------------- hoặc Đăng nhập với ---------------</p>
        <div className="w-full flex-center justify-around">
          <div
            onClick={() => handleLogin(facebookProvider)}
            className="flex-center gap-2 cursor-pointer 
            rounded-md hover:bg-dark/30 p-2"
          >
            <FontAwesomeIcon className="text-2xl" icon={faFacebook} />
            <span className="text-[16px]">Facebook</span>
          </div>
          <div
            onClick={() => handleLogin(googleProvider)}
            className="flex-center gap-2 cursor-pointer 
            rounded-md hover:bg-dark/30 p-2"
          >
            <FontAwesomeIcon className="text-2xl" icon={faGoogle} />
            <span className="text-[16px]">Google</span>
          </div>
        </div>
        <p>
         Bạn chưa có tài khoản?{' '}
          <Link to="/register" className="font-bold text-bg-messages">
            <u>Đăng ký</u>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
