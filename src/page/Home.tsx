import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, CssBaseline, List } from '@mui/material';
import StudyRoomItem from 'component/StudyRoomItem';
import axios from 'axios';
import { Form, Modal } from 'react-bootstrap';
import { BASE_URL } from 'hooks/BaseUrl';
import StudyRoomModal from 'component/StudyRoomModal';
import logo from '../assets/logo.svg';
import banner from '../assets/banner.svg';
import { Nav, NavLink, NavBtn, NavBtnLink } from './Navbar';
import { Banner, BannerOne, BannerTwo, BannerThree } from './BannerElement';

interface StudyRoomProps {
  roomUuid: string;
  roomName: string;
}

export default function Home() {
  const [studyRoomItems, setStudyRoomItems] = useState<StudyRoomProps[]>([]);

  const [showStudyRoomModal, setShowStudyRoomModal] = useState<boolean>(false);
  const handleStudyRoomModalClose = () => setShowStudyRoomModal(false);
  const handleStudyRoomModalShow = () => setShowStudyRoomModal(true);

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

  return (
    <div>
      <Nav>
        <NavLink to="/">
          <img src={logo} alt="logo" />
        </NavLink>
        <NavBtn>
          <NavBtnLink to="/signin">Login</NavBtnLink>
          <NavBtnLink to="/signin">Sign Up</NavBtnLink>
        </NavBtn>
      </Nav>
      <Banner>
        <BannerOne>
          Connect & Communicate
          <br />
          Face-to-Face
        </BannerOne>
        <BannerTwo>
          멤버들과 실시간으로 소통하며, 공부 자료를 공유하는 온라인 스터디를
          경험하세요.
        </BannerTwo>
        <BannerThree>
          <img src={banner} alt="logo" />
        </BannerThree>
      </Banner>
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
