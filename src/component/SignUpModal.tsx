import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { BASE_URL } from 'hooks/BaseUrl';
import { NavBtn, Btn, FormBtnLink, BtnSpan, BtnDiv } from '../page/Navbar';
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
  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>회원가입</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label />
            <Form.Control placeholder="이름" />
          </Form.Group>
          <Form.Group>
            <Form.Label />
            <Form.Control placeholder="아이디" />
          </Form.Group>
          <Form.Group>
            <Form.Label />
            <Form.Control placeholder="비밀번호" />
          </Form.Group>
          <NavBtn>
            <FormBtnLink to="/" onClick={handleCloseModal}>
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
