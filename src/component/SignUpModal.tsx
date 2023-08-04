import React, { useState } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { BASE_URL } from 'hooks/BaseUrl';
import { NavBtn, Btn, FormBtnLink, BtnSpan, BtnDiv } from '../page/css/Navbar';
import LoginModal from './LoginModal';

export interface SignUpModalProps {
  showModal: boolean;
  handleCloseModal: () => void;
  handleLoginFromSignup: () => void;
}

// eslint-disable-next-line react/function-component-definition
const SignUpModal: React.FunctionComponent<SignUpModalProps> = ({
  showModal,
  handleCloseModal,
  handleLoginFromSignup,
}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [nickName, setNickName] = useState<string>('');

  const onClickSignUp = () => {
    axios
      .post(`${BASE_URL}/users/signUp`, {
        email,
        password,
        nickName,
      })
      .then((res) => {
        alert('회원가입에 성공했습니다.');
        handleCloseModal();
      })
      .catch((err) => {
        if (err.response.data.businessCode === 'U003') {
          alert('이미 존재하는 이메일입니다. 다시 확인해주십시오.');
        }
      });
  };
  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>회원가입</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
          <Form.Group>
            <Form.Label />
            <Form.Control
              placeholder="닉네임"
              onChange={(e) => {
                setNickName(e.target.value);
              }}
            />
          </Form.Group>
          <NavBtn>
            <FormBtnLink to="/" onClick={onClickSignUp}>
              회원가입
            </FormBtnLink>
          </NavBtn>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <BtnDiv>
          <BtnSpan>이미 가입하셨나요?</BtnSpan>
          <Btn to="/" onClick={handleLoginFromSignup}>
            로그인
          </Btn>
        </BtnDiv>
      </Modal.Footer>
    </Modal>
  );
};

export default SignUpModal;
