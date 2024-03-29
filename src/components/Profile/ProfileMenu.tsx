import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';
import { FaExchangeAlt } from 'react-icons/fa';
import { IoLogoInstagram } from 'react-icons/io';
import { AiOutlinePlusCircle } from 'react-icons/ai';

import SignIn from '@components/Auth/SignIn';
import SignUp from '@components/Auth/SignUp';
import ProfileEdit from '@components/Profile/ProfileEdit';
import { ThemeContext } from '../../Context';

interface ProfileMenuProps {
  userCheck: boolean;
  thisUser: IUserObj;
  userObj: IUserObj | null | undefined;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  userCheck,
  thisUser,
  userObj,
}) => {
  const [isEditClick, setIsEditClick] = useState<boolean>(false);
  const [isSignInClick, setIsSignInClick] = useState<boolean>(false);
  const [isSignUpClick, setIsSignUpClick] = useState<boolean>(false);

  const { theme } = useContext(ThemeContext);

  const toggleProfileEdit = (): void => setIsEditClick(!isEditClick);

  const toggleSignIn = (): void => setIsSignInClick(!isSignInClick);

  const toggleSignUp = (): void => setIsSignUpClick(!isSignUpClick);

  const handleInstagram = (): void => {
    if (typeof open === 'function') {
      open(`https://www.instagram.com/${thisUser.instagram}/`);
    } else {
      location.href = `https://www.instagram.com/${thisUser.instagram}/`;
    }
  };

  return (
    <>
      <ProfileMenuContainer>
        <ProfileMenuWrap theme={theme}>
          <ProfileInfoWrap>
            <AvatarWrap>
              <img src={thisUser.avatar} alt="프로필 사진" />
            </AvatarWrap>
            <AvatarInfoWrap>
              <InfoContent>
                <span>닉네임</span>
                <Nickname>{thisUser.nickname}</Nickname>
              </InfoContent>
              <InfoContent>
                <span>포스팅</span>
                <PostConunt>{thisUser.records.length}</PostConunt>
              </InfoContent>
              {thisUser.instagram && (
                <InfoContent>
                  <IoLogoInstagram size={18} />
                  <Instagram onClick={handleInstagram}>
                    @{thisUser.instagram}
                  </Instagram>
                </InfoContent>
              )}
            </AvatarInfoWrap>
          </ProfileInfoWrap>
          {!userObj ? (
            <OtherUserWrap>
              <OtherUser onClick={toggleSignIn}>
                로그인을 하여 더 많은 서비스를 이용해보세요 !
              </OtherUser>
            </OtherUserWrap>
          ) : (
            <>
              {userCheck && (
                <MenuWrap>
                  <MenuLink to={'/upload'}>
                    <Menu theme={theme}>
                      <AiOutlinePlusCircle size={'18'} />
                      <span>여행기록 올리기</span>
                    </Menu>
                  </MenuLink>
                  <MenuLink to={`/myAccount/${userObj.userId}`}>
                    <Menu theme={theme}>
                      <FaExchangeAlt size={'18'} />
                      <span>계정정보 변경</span>
                    </Menu>
                  </MenuLink>
                  <Menu theme={theme} onClick={toggleProfileEdit}>
                    <CgProfile size={'18'} />
                    <span>프로필 변경</span>
                  </Menu>
                </MenuWrap>
              )}
            </>
          )}
        </ProfileMenuWrap>
      </ProfileMenuContainer>
      {isEditClick && userObj && (
        <ProfileEdit toggleProfileEdit={toggleProfileEdit} userObj={userObj} />
      )}
      {isSignInClick && (
        <SignIn toggleSignIn={toggleSignIn} toggleSignUp={toggleSignUp} />
      )}
      {isSignUpClick && <SignUp toggleSignUp={toggleSignUp} />}
    </>
  );
};

const ProfileMenuContainer = styled.div`
  width: 100%;
  padding-top: 100px;
`;

const ProfileMenuWrap = styled.div`
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 0 20px;
  }
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${(props) => props.theme.menuColor};
  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.3);
  padding: 0 40px;
`;

const ProfileInfoWrap = styled.div`
  @media (max-width: 768px) {
    justify-content: center;
  }
  @media (max-width: 500px) {
    flex-direction: column;
  }
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 20px 0;
`;

const AvatarWrap = styled.div`
  position: relative;
  width: 150px;
  ::before {
    content: '';
    display: block;
    margin-top: 100%;
  }
  & img {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 50%;
  }
`;

const AvatarInfoWrap = styled.div`
  @media (max-width: 500px) {
    padding: 20px 0;
  }
  width: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px 20px;
  gap: 10px 0;
`;

const InfoContent = styled.div`
  @media (max-width: 500px) {
    align-items: center;
  }
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 3px 0;
`;

const Nickname = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-top: 5px;
`;

const Instagram = styled.div`
  font-size: 14px;
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
  margin-top: 5px;
`;

const PostConunt = styled.div`
  font-size: 18px;
  margin-top: 5px;
`;
const OtherUserWrap = styled.div`
  @media (max-width: 768px) {
    justify-content: center;
    padding: 20px 0;
  }
  width: 100%;
  display: flex;
  justify-content: flex-start;
`;

const OtherUser = styled.span`
  font-size: 20px;
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;
`;

const MenuWrap = styled.div`
  @media (max-width: 1400px) {
    flex-direction: column;
    gap: 15px 0;
  }
  @media (max-width: 768px) {
    width: 75%;
  }
  @media (max-width: 500px) {
    width: 100%;
  }
  padding: 20px 0;
  width: 100%;
  display: flex;
  gap: 0 30px;
  justify-content: flex-end;
  align-items: flex-start;
`;

const MenuLink = styled(Link)`
  @media (max-width: 1400px) {
    width: 100%;
  }
`;

const Menu = styled.div`
  @media (max-width: 1400px) {
    width: 100%;
  }
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px 25px;
  border: 1px solid #16a085;
  border-radius: 5px;
  background: ${(props) => props.theme.bgColor};
  cursor: pointer;
  & span {
    font-size: 14px;
    margin-left: 10px;
  }
`;

export default ProfileMenu;
