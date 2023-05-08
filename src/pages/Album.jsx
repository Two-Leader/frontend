import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import 'bootstrap/dist/css/bootstrap.min.css';
import {SectionsContainer, Section} from 'react-fullpage';

const cards = [1, 2, 3];
const theme = createTheme();

export default function Album() {
    const movePage = useNavigate();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    

    function GoRoom(){
      movePage('/room');
    }
    let options = {
      anchors: ['sectionOne', 'sectionTwo', 'sectionThree'],
    };
  return (
    
    <ThemeProvider theme={theme} >
      <CssBaseline />
      <AppBar position="relative" >
        <Toolbar>
          <CameraIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap>
            Two Leader
          </Typography>
          {/* <div >
            <Button variant="contained">로그인</Button>
            <Button variant="outlined">방 생성</Button>
          </div> */}
        </Toolbar>
        
      </AppBar>
      <main>
        
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 10,
            pb: 4,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h4"
              variant="h4"
              align="center"
              color="text.primary"
              gutterBottom
            >
             맞춤형 캠스터디 Two Leader
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
             모두와 함께 공부해보는 색다른 경험을 체험하세요.
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button variant="contained" onClick={GoRoom}>입장</Button>
              <Button variant="outlined" onClick={handleShow}>방 생성</Button>
              <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>방 생성</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                <Form.Group className="mb-3">
                <Form.Label>날짜</Form.Label >
                <Form.Control
                  type="date"
                  autoFocus
                  id ="when"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>방 이름</Form.Label >
                <Form.Control
                  type="text"
                  autoFocus
                  id ="title"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>비밀번호</Form.Label >
                <Form.Control
                  type="password"
                  autoFocus
                  id ="title"
                />
              </Form.Group>
             </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn_close" variant="secondary" onClick={handleClose}>
                        닫기
                    </Button>
          
                    <Button type="submit" variant="primary second"
                    onClick={()=> { handleClose();}}> 
                      확인 
                    </Button>
                </Modal.Footer>
            </Modal>
            </Stack>
          </Container>
        </Box>
        
        <Container sx={{ py: 8 }} maxWidth="lg">
          <Grid container spacing={4}>
            {cards.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      pt: '30%',
                    }}
                    image="https://source.unsplash.com/random"
                    alt="random"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Heading
                    </Typography>
                    <Typography>
                      This is a media card. You can use this section to describe the
                      content.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
}