import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, CssBaseline, List } from '@mui/material';
import StudyRoomItem from 'component/StudyRoomItem';
import axios from 'axios';
import { Form, Modal } from 'react-bootstrap';
import { BASE_URL } from 'hooks/BaseUrl';
import StudyRoomModal from 'component/StudyRoomModal';
import { Translate } from '@mui/icons-material';
import logo from '../assets/logo.svg';
import plus from '../assets/plusbutton.svg';
import studyroom from '../assets/studyroom.svg';
import banner from '../assets/banner.svg';
import { Nav, NavLink, NavBtn, NavBtnLink } from './css/Navbar';
import {
  Banner,
  BannerOne,
  BannerTwo,
  BannerThree,
  Round,
  RoundCenter,
  RoundText,
  FlexStudyRoom,
  FlexDiv,
} from './css/BannerElement';
import LoginModal from '../component/LoginModal';
import SignUpModal, { SignUpModalProps } from '../component/SignUpModal';

interface StudyRoomProps {
  roomUuid: string;
  roomName: string;
}

export default function Home() {
  const [typedText, setTypedText] = useState('');
  const [studyRoomItems, setStudyRoomItems] = useState<StudyRoomProps[]>([]);

  const [showStudyRoomModal, setShowStudyRoomModal] = useState<boolean>(false);
  const handleStudyRoomModalClose = () => setShowStudyRoomModal(false);
  const handleStudyRoomModalShow = () => setShowStudyRoomModal(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleLoginButtonClick = () => {
    setShowLoginModal(true);
  };

  const handleSignupButtonClick = () => {
    setShowSignupModal(true);
  };

  const handleLoginCloseModal = () => {
    setShowLoginModal(false);
  };

  const handleSignupCloseModal = () => {
    setShowSignupModal(false);
  };

  const handleLoginFromSignup = () => {
    setShowLoginModal(true);
    setShowSignupModal(false);
  };
  const handleSignupFromLogin = () => {
    setShowSignupModal(true);
    setShowLoginModal(false);
  };

  const studyRoomDatas = useCallback(() => {
    axios
      .get(`${BASE_URL}/studies`)
      .then((response) => {
        if (response.status === 200) {
          setStudyRoomItems(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    studyRoomDatas();
  }, [studyRoomDatas]);

  useEffect(() => {
    const content = 'Face-to-Face';
    let i = 0;

    const typingInterval = setInterval(() => {
      if (i < content.length) {
        const txt = content.charAt(i);
        setTypedText((prevText) => prevText + txt);
        // eslint-disable-next-line no-plusplus
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    return () => {
      clearInterval(typingInterval);
    };
  }, []);

  return (
    <div>
      <Nav>
        <NavLink to="/">
          <img src={logo} alt="logo" />
        </NavLink>
        <NavBtn>
          <NavBtnLink to="/" onClick={handleLoginButtonClick}>
            LOGIN
          </NavBtnLink>
          <NavBtnLink to="/" onClick={handleSignupButtonClick}>
            SIGNUP
          </NavBtnLink>
        </NavBtn>

        <LoginModal
          showModal={showLoginModal}
          handleCloseModal={handleLoginCloseModal}
          handleSignupFromLogin={handleSignupFromLogin}
        />

        <SignUpModal
          showModal={showSignupModal}
          handleCloseModal={handleSignupCloseModal}
          handleLoginFromSignup={handleLoginFromSignup}
        />
      </Nav>
      <Banner>
        <BannerOne>
          Connect & Communicate
          <br />
          {/* Face-to-Face */}
          {typedText}
        </BannerOne>
        <BannerTwo>
          멤버들과 실시간으로 소통하며, 공부 자료를 공유하는 온라인 스터디를
          경험하세요.
        </BannerTwo>
        <BannerThree>
          <img src={banner} alt="logo" />
        </BannerThree>
      </Banner>
      <RoundText>user.name의 스터디</RoundText>
      <RoundCenter>
        <Round>
          <img src={plus} alt="plus" />
        </Round>
      </RoundCenter>
      <RoundText>스터디 찾기</RoundText>
      <FlexStudyRoom>
        {[...Array(5)].map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <React.Fragment key={index}>
            <FlexDiv>
              <span
                style={{
                  marginBottom: '72%',
                  marginRight: '50%',
                  color: '#fff',
                }}
              >
                3 / 5
              </span>
            </FlexDiv>
          </React.Fragment>
        ))}
      </FlexStudyRoom>
      {/* <FlexStudyRoom>
        {[...Array(5)].map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <React.Fragment key={index}>
            <img src={studyroom} alt="studyroom" />
            <span
              style={{
                display: 'flex',
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
                flexDirection: 'column',
              }}
            >
              3/5
            </span>
          </React.Fragment>
        ))}
      </FlexStudyRoom> */}
    </div>
    //   <Box>
    //   <CssBaseline />
    //   <Box>
    //     <List>
    //       {studyRoomItems.map((studyRoomItem) => (
    //         <StudyRoomItem
    //           key={studyRoomItem.roomUuid}
    //           roomUuid={studyRoomItem.roomUuid}
    //           roomName={studyRoomItem.roomName}
    //         />
    //       ))}
    //     </List>
    //   </Box>
    //   <Box>
    //     <Button onClick={handleStudyRoomModalShow}>Create StudyRoom</Button>
    //     {/* ============== Modal ============== */}
    //     <StudyRoomModal
    //       showStudyRoomModal={showStudyRoomModal}
    //       handleStudyRoomModalClose={handleStudyRoomModalClose}
    //       studyRoomDatas={studyRoomDatas}
    //     />
    //     {/* ============== Modal ============== */}
    //   </Box>
    // </Box>
  );
}
