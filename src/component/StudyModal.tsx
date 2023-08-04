/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { BASE_URL } from 'hooks/BaseUrl';
import { NavBtn, Btn, FormBtnLink, BtnSpan, BtnDiv } from '../page/css/Navbar';

interface StudyModalProps {
  showModal: boolean;
  handleCloseModal: () => void;
}

// eslint-disable-next-line react/function-component-definition
const StudyModal: React.FunctionComponent<StudyModalProps> = ({
  showModal,
  handleCloseModal,
}) => {
  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>스터디 방 생성</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Add your login form or content here */}
        <Form>
          <Form.Group>
            <Form.Label>스터디 제목</Form.Label>
            <Form.Control placeholder="제목을 입력하세요." />
          </Form.Group>
          <Form.Group>
            <Form.Label>스터디 비밀번호</Form.Label>
            <Form.Control placeholder="비밀번호를 입력하세요." />
          </Form.Group>
          <Form.Group>
            <Form.Label>간단 소개글</Form.Label>
            <Form.Control placeholder="소개글을 입력하세요." />
          </Form.Group>
          <Form.Group>
            <Form.Label>공개 여부</Form.Label>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="exampleRadios"
                id="exampleRadios1"
                value="option1"
                checked
              />
              <label className="form-check-label" htmlFor="exampleRadios1">
                공개
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="exampleRadios"
                id="exampleRadios2"
                value="option2"
              />
              <label className="form-check-label" htmlFor="exampleRadios2">
                비공개
              </label>
            </div>
          </Form.Group>
          <Form.Group>
            <Form.Label>참가 인원</Form.Label>
            <select className="form-select">
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
          </Form.Group>
          <NavBtn>
            <FormBtnLink to="/StudyEnterRoom" onClick={handleCloseModal}>
              스터디 방 생성
            </FormBtnLink>
          </NavBtn>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default StudyModal;
