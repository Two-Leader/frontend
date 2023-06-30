// // import {
// //   MDBBtn,
// //   MDBCollapse,
// //   MDBContainer,
// //   MDBIcon,
// //   MDBNavbar,
// //   MDBNavbarItem,
// //   MDBNavbarLink,
// //   MDBNavbarNav,
// //   MDBNavbarToggler,
// // } from 'mdb-react-ui-kit';
// // import { useState } from 'react';
// // import LoginModal from './LoginModal';

// export default function HeaderItem() {
//   const [showBasic, setShowBasic] = useState(false);
//   const [loginModal, setLoginModal] = useState(false);
//   const loginToggleShow = () => setLoginModal(!loginModal);
//   return (
//     <header>
//       <MDBNavbar expand="lg" light bgColor="white" fixed="true">
//         <MDBContainer fluid>
//           <MDBCollapse show>
//             <MDBNavbarNav right className="mb-2 mb-lg-0">
//               <MDBNavbarItem active>
//                 <MDBNavbarLink aria-current="page" href="#">
//                   Home
//                 </MDBNavbarLink>
//               </MDBNavbarItem>
//               <MDBNavbarItem>
//                 {sessionStorage.getItem('token') ? (
//                   <MDBBtn className="bg-primary">LOGOUT</MDBBtn>
//                 ) : (
//                   <MDBBtn className="bg-primary" onClick={loginToggleShow}>
//                     LOGIN
//                   </MDBBtn>
//                 )}
//               </MDBNavbarItem>
//             </MDBNavbarNav>
//           </MDBCollapse>
//         </MDBContainer>
//         <LoginModal
//           loginToggleShow={loginToggleShow}
//           loginModal={loginModal}
//           setLoginModal={setLoginModal}
//         />
//       </MDBNavbar>
//     </header>
//   );
// }
