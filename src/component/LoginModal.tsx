import React, { useState } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { BASE_URL } from 'hooks/BaseUrl';
import { NavBtn, Btn, FormBtnLink, BtnSpan, BtnDiv } from '../page/css/Navbar';

interface LoginModalProps {
  showModal: boolean;
  handleCloseModal: () => void;
  handleSignupFromLogin: () => void;
}

// eslint-disable-next-line react/function-component-definition
const LoginModal: React.FunctionComponent<LoginModalProps> = ({
  showModal,
  handleCloseModal,
  handleSignupFromLogin,
}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const onClickLogin = () => {
    axios
      .post(`${BASE_URL}/users/login`, {
        email,
        password,
      })
      .then((res) => {
        sessionStorage.setItem('nickName', res.data.data.nickName);
        sessionStorage.setItem('token', res.data.data.nickName);
        handleCloseModal();
      })
      .catch((err) => {
        if (err.response.data.businessCode === 'U002') {
          alert('이메일 또는 비밀번호가 틀렸습니다. 다시 확인해주십시오.');
        }
      });
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>로그인</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Add your login form or content here */}
        <Form>
          <Form.Group>
            <Form.Label />
            <Form.Control
              placeholder="이메일"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label />
            <Form.Control
              placeholder="비밀번호"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </Form.Group>
          <NavBtn>
            <FormBtnLink to="/LoginHome" onClick={handleCloseModal}>
              로그인
            </FormBtnLink>
          </NavBtn>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <BtnDiv>
          <BtnSpan>회원이 아니신가요?</BtnSpan>
          <Btn to="/" onClick={handleSignupFromLogin}>
            회원가입
          </Btn>
        </BtnDiv>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginModal;
