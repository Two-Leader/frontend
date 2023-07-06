import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from 'hooks/BaseUrl';
import logo from '../assets/logo.svg';
import { Nav, NavLink, NavBtn, NavBtnLink } from './css/Navbar';
import {
  Round,
  RoundCenter,
  RoundText,
  FlexStudyRoom,
  FlexDiv,
  FlexMyDiv,
} from './css/BannerElement';
import StudyModal from '../component/StudyModal';

interface StudyRoomProps {
  roomUuid: string;
  roomName: string;
}

export default function AfterLoginHome() {
  const [typedText, setTypedText] = useState('');
  const [studyRoomItems, setStudyRoomItems] = useState<StudyRoomProps[]>([]);
  const [showStudyModal, setShowStudyModal] = useState(false);

  const handleStudyButtonClick = () => {
    setShowStudyModal(true);
  };
  const handleStudyCloseModal = () => {
    setShowStudyModal(false);
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
          <NavBtnLink to="/">LOGOUT</NavBtnLink>
          <NavBtnLink to="/LoginHome" onClick={handleStudyButtonClick}>
            스터디 방 생성
          </NavBtnLink>
        </NavBtn>

        <StudyModal
          showModal={showStudyModal}
          handleCloseModal={handleStudyCloseModal}
        />
      </Nav>
      <RoundCenter>
        <Round />
      </RoundCenter>
      <RoundText>user.name의 스터디</RoundText>
      <RoundCenter>
        <Round>
          <FlexStudyRoom>
            {[...Array(4)].map((_, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <React.Fragment key={index}>
                <FlexMyDiv>
                  <span
                    style={{
                      marginBottom: '72%',
                      marginRight: '50%',
                      color: '#fff',
                    }}
                  >
                    3 / 5
                  </span>
                </FlexMyDiv>
              </React.Fragment>
            ))}
          </FlexStudyRoom>
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
    </div>
  );
}
