// import axios from 'axios';
// import { BASE_URL } from 'hooks/BaseUrl';
// import {
//   MDBBtn,
//   MDBCheckbox,
//   MDBContainer,
//   MDBIcon,
//   MDBInput,
//   MDBModal,
//   MDBModalBody,
//   MDBModalContent,
//   MDBModalDialog,
//   MDBModalFooter,
//   MDBTabs,
//   MDBTabsContent,
//   MDBTabsItem,
//   MDBTabsLink,
//   MDBTabsPane,
// } from 'mdb-react-ui-kit';
// import { SetStateAction, useState } from 'react';

// interface LoginProps {
//   loginModal: any;
//   setLoginModal: any;
//   loginToggleShow: any;
// }
// export default function LoginModal({
//   loginModal,
//   setLoginModal,
//   loginToggleShow,
// }: LoginProps) {
//   const [justifyActive, setJustifyActive] = useState<string>('login');
//   const [loginEmail, setLoginEmail] = useState<string>('');
//   const [loginPW, setLoginPW] = useState<string>('');
//   const [registerEmail, setRegisterEmail] = useState<string>('');
//   const [registerPW, setRegisterPW] = useState<string>('');
//   const [registerName, setRegisterName] = useState<string>('');

//   const handleJustifyClick = (value: SetStateAction<string>) => {
//     if (value === justifyActive) {
//       return;
//     }
//     setJustifyActive(value);
//   };

//   const onClickLogin = () => {
//     axios
//       .post(`${BASE_URL}/users/login`, {
//         email: loginEmail,
//         password: loginPW,
//       })
//       .then((res) => {
//         sessionStorage.setItem('token', res.data.data);
//         loginToggleShow();
//       })
//       .catch((err) => {
//         if (err.response.data.businessCode === 'U002') {
//           alert('이메일 또는 비밀번호가 틀렸습니다. 다시 확인해주십시오.');
//         }
//       });
//   };

//   const onClickRegister = () => {
//     axios
//       .post(`${BASE_URL}/users/signUp`, {
//         email: registerEmail,
//         password: registerPW,
//         nickName: registerName,
//       })
//       .then((res) => {
//         alert('회원가입이 성공적으로 이뤄졌습니다.');
//       })
//       .catch((err) => {
//         if (err.response.data.businessCode === 'U001') {
//           alert('이미 존재하는 이메일입니다. 다른 이메일을 사용하세요.');
//         }
//       });
//   };

//   return (
//     <MDBModal show={loginModal} setShow={setLoginModal} tabIndex="-1">
//       <MDBModalDialog>
//         <MDBModalContent>
//           <MDBModalBody>
//             <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
//               <MDBTabs
//                 pills
//                 justify
//                 className="mb-3 d-flex flex-row justify-content-between"
//               >
//                 <MDBTabsItem>
//                   <MDBTabsLink
//                     onClick={() => handleJustifyClick('login')}
//                     active={justifyActive === 'login'}
//                   >
//                     Login
//                   </MDBTabsLink>
//                 </MDBTabsItem>
//                 <MDBTabsItem>
//                   <MDBTabsLink
//                     onClick={() => handleJustifyClick('register')}
//                     active={justifyActive === 'register'}
//                   >
//                     Register
//                   </MDBTabsLink>
//                 </MDBTabsItem>
//               </MDBTabs>

//               <MDBTabsContent>
//                 <MDBTabsPane show={justifyActive === 'login'}>
//                   <MDBInput
//                     wrapperClass="mb-4"
//                     label="Email"
//                     type="email"
//                     onChange={(e) => {
//                       setLoginEmail(e.target.value);
//                     }}
//                   />
//                   <MDBInput
//                     wrapperClass="mb-4"
//                     label="Password"
//                     type="password"
//                     onChange={(e) => {
//                       setLoginPW(e.target.value);
//                     }}
//                   />

//                   <MDBBtn className="mb-4 w-100" onClick={onClickLogin}>
//                     Sign in
//                   </MDBBtn>
//                   <p className="text-center">
//                     Not a member? <a href="#!">Register</a>
//                   </p>
//                 </MDBTabsPane>

//                 <MDBTabsPane show={justifyActive === 'register'}>
//                   <MDBInput
//                     wrapperClass="mb-4"
//                     label="Email"
//                     type="email"
//                     onChange={(e) => {
//                       setRegisterEmail(e.target.value);
//                     }}
//                   />

//                   <MDBInput
//                     wrapperClass="mb-4"
//                     label="Password"
//                     type="password"
//                     onChange={(e) => {
//                       setRegisterPW(e.target.value);
//                     }}
//                   />
//                   <MDBInput
//                     wrapperClass="mb-4"
//                     label="Username"
//                     type="text"
//                     onChange={(e) => {
//                       setRegisterName(e.target.value);
//                     }}
//                   />

//                   <MDBBtn className="mb-4 w-100" onClick={onClickRegister}>
//                     Sign up
//                   </MDBBtn>
//                 </MDBTabsPane>
//               </MDBTabsContent>
//             </MDBContainer>
//           </MDBModalBody>
//           <MDBModalFooter>
//             <MDBBtn color="secondary" onClick={loginToggleShow}>
//               Close
//             </MDBBtn>
//           </MDBModalFooter>
//         </MDBModalContent>
//       </MDBModalDialog>
//     </MDBModal>
//   );
// }
import React, { useState } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { BASE_URL } from 'hooks/BaseUrl';
import { NavBtn, Btn, FormBtnLink, BtnSpan, BtnDiv } from '../page/Navbar';

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
            <FormBtnLink to="/" onClick={onClickLogin}>
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
