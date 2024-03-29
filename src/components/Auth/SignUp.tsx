import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { BsBoxArrowInLeft } from 'react-icons/bs';
import { FcGoogle } from 'react-icons/fc';

import { firebaseAuth, firebaseInstance } from '@src/firebaseConfig';
import { ThemeContext } from '@src/Context';
import { CreateUser } from '@_firebase/auth/CreateUser';
import { CreateSocialUser } from '@_firebase/auth/CreateSocialUser';
import Loading from '@components/Load/Loading';

interface SignUpProps {
  toggleSignUp(): void;
}

interface InputsProps {
  email: string;
  nickname: string;
  password: string;
  passwordConfirm: string;
}

const SignUp: React.FC<SignUpProps> = ({ toggleSignUp }) => {
  const [inputs, setInputs] = useState<InputsProps>({
    email: '',
    nickname: '',
    password: '',
    passwordConfirm: '',
  });
  const [loading, setLoading] = useState<boolean>(false);

  const { theme } = useContext(ThemeContext);

  const { email, nickname, password, passwordConfirm } = inputs;

  const closeButton = () => toggleSignUp();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const handleSignUp = () => {
    if (password !== passwordConfirm) return alert('비밀번호를 확인해주세요.');
    if (!nickname) return alert('닉네임을 입력해주세요.');

    setLoading(true);
    firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        firebaseAuth.currentUser
          ?.sendEmailVerification()
          .then(() => CreateUser(email, nickname))
          .then(() => firebaseAuth.signOut())
          .then(() => {
            alert(
              '회원가입이 완료되었습니다.\n등록한 이메일로 발송된 확인링크 인증 후 서비스 이용이 가능합니다. ',
            );
            location.reload();
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => {
        if (error.code === 'auth/weak-password') {
          alert('비밀번호는 6자리 이상의 영문 + 특수문자로 입력해주세요.');
          console.log(error.code);
        } else if (error.code === 'auth/email-already-in-use') {
          alert('이미 사용중인 이메일 입니다.');
        } else if (error.code === 'auth/invalid-email') {
          alert('이메일을 정확하게 입력해주세요.');
        } else {
          alert(error.code);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const googleSignIn = () => {
    setLoading(true);
    const provider = new firebaseInstance.auth.GoogleAuthProvider();
    firebaseAuth
      .signInWithPopup(provider)
      .then((result: any) => {
        if (result.additionalUserInfo.isNewUser)
          return CreateSocialUser(
            result.user.email,
            result.user.displayName,
            result.user.photoURL,
          );
      })
      .then(() => location.reload())
      .catch((error) => {
        alert(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <SignUpContainer>
      <SignUpWrap theme={theme}>
        <SignUpHeaderWrap>
          <IconWrap>
            <BsBoxArrowInLeft onClick={closeButton} />
          </IconWrap>
          <h3>회원가입</h3>
        </SignUpHeaderWrap>
        <SignUpContentWrap>
          {loading ? (
            <Loading />
          ) : (
            <>
              <InputContainer>
                <InputWrap>
                  <input
                    type="email"
                    placeholder="이메일"
                    name="email"
                    onChange={onChange}
                    required
                  />
                  <InputTextWrap>
                    <span>
                      이메일 링크 확인을 위해, 정확한 이메일을 입력해주세요.
                    </span>
                  </InputTextWrap>
                </InputWrap>
                <InputWrap>
                  <input
                    type="text"
                    placeholder="닉네임"
                    name="nickname"
                    onChange={onChange}
                    required
                  />
                  <InputTextWrap>
                    <span>
                      닉네임은 한글 2~8자 영문 4자~16자로 작성해주세요.
                    </span>
                  </InputTextWrap>
                </InputWrap>
                <InputWrap>
                  <input
                    type="password"
                    placeholder="비밀번호"
                    name="password"
                    onChange={onChange}
                    required
                  />
                  <InputTextWrap>
                    <span>비밀번호는 6자이상으로 입력해주세요.</span>
                  </InputTextWrap>
                </InputWrap>
                <InputWrap>
                  <input
                    type="password"
                    placeholder="비밀번호 확인"
                    name="passwordConfirm"
                    onChange={onChange}
                    required
                  />
                </InputWrap>
              </InputContainer>
              <ButtonWrap theme={theme}>
                <button onClick={handleSignUp}>회원가입</button>
                <button onClick={googleSignIn}>
                  <FcGoogle />
                  Google로 로그인 하기
                </button>
              </ButtonWrap>
            </>
          )}
        </SignUpContentWrap>
      </SignUpWrap>
    </SignUpContainer>
  );
};

const SignUpContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  background: rgba(0, 0, 0, 0.4);
`;

const SignUpWrap = styled.div`
  @media (max-width: 500px) {
    width: 90%;
    border-radius: 15px;
  }
  @media (max-width: 320px) {
    width: 95%;
  }
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 450px;
  max-height: 90%;
  overflow-y: auto;
  background: ${(props) => props.theme.menuColor};
  border-radius: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
`;

const SignUpHeaderWrap = styled.div`
  width: 100%;
  display: flex;
  position: relative;
  border-bottom: 1px solid #ababab80;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  & h3 {
    @media (max-width: 500px) {
      font-size: 14px;
    }
    font-size: 20px;
  }
`;

const IconWrap = styled.div`
  @media (max-width: 500px) {
    width: 20px;
    height: 20px;
  }
  width: 26px;
  height: 26px;
  position: absolute;
  left: 40px;
  cursor: pointer;
  & svg {
    font-size: 24px;
    @media (max-width: 500px) {
      font-size: 18px;
    }
  }
`;

const SignUpContentWrap = styled.div`
  width: 100%;
  padding: 30px 0;
  max-height: calc(90vh - 61px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputContainer = styled.div`
  @media (max-width: 500px) {
    padding: 0 20px;
    gap: 10px 0;
  }
  width: 100%;
  display: flex;
  padding: 0px 50px;
  margin-bottom: 30px;
  gap: 20px 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const InputWrap = styled.div`
  width: 100%;
  & input {
    @media (max-width: 500px) {
      height: 35px;
      border-radius: 10px;
      padding-left: 10px;
    }
    -webkit-appearance: none;
    width: 100%;
    height: 45px;
    margin-bottom: 3px;
    padding-left: 20px;
    border-radius: 15px;
    border-style: none;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    ::placeholder {
      @media (max-width: 500px) {
        font-size: 10px;
      }
      font-size: 14px;
    }
    :focus {
      outline: none;
      border: 2px solid #16a085;
    }
  }
`;

const InputTextWrap = styled.div`
  width: 100%;
  padding: 5px 10px;
  & span {
    @media (max-width: 500px) {
      font-size: 10px;
    }

    font-size: 12px;
    color: grey;
  }
`;

const ButtonWrap = styled.div`
  @media (max-width: 500px) {
    padding: 0 20px;
  }
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 40px;
  & button {
    @media (max-width: 500px) {
      font-size: 12px;
      height: 40px;
    }
    width: 100%;
    height: 50px;
    border-radius: 15px;
    font-size: 16px;
    border: 1px solid #16a085;
    :first-child {
      background: ${(props) => props.theme.mainColor};
      color: white;
      margin-bottom: 15px;
    }
    :last-child {
      display: flex;
      justify-content: center;
      position: relative;
      align-items: center;
      & svg {
        @media (max-width: 500px) {
          font-size: 18px;
          left: 15px;
        }
        position: absolute;
        left: 20px;
        font-size: 24px;
      }
    }
  }
`;

export default SignUp;
