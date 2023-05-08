import React, { useState } from 'react';
import Webcam from "react-webcam";
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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Album.css'
import people from '../assets/img.jpg';

export default function Room() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

  return (
    <Swiper
    slidesPerView={4}
    centeredSlides={true}
    spaceBetween={30}
    grabCursor={true}
    pagination={{
      clickable: true,
    }}
    modules={[Pagination]}
    className="mySwiper"
  >
    <SwiperSlide>
      <div className = "slide-container">
      <div className = "slide-content">
        <div className="card-wrapper">
          <div className="card">
            <div className="image-content">
              <span className="overlay"></span>

                <div className="card-image">
                  <img src={people} alt = "1" className ="card-img"/>
                </div>
            </div>

                <div className="card-content">
                  <h2 className ="name">Jung</h2>
                  <p className="description">This is a media card. You can use this section to describe the content.</p>
                  <button className="button">View More</button>
                </div>
          </div>
        </div>
      </div>
    </div>
    </SwiperSlide>
    <SwiperSlide>
      <div className = "slide-container">
      <div className = "slide-content">
        <div className="card-wrapper">
          <div className="card">
            <div className="image-content">
              <span className="overlay"></span>

                <div className="card-image">
                  <img src={people} alt = "1" className ="card-img"/>
                </div>
            </div>

                <div className="card-content">
                  <h2 className ="name">Jung</h2>
                  <p className="description">This is a media card. You can use this section to describe the content.</p>
                  <button className="button">View More</button>
                </div>
          </div>
        </div>
      </div>
    </div>
    </SwiperSlide>
    </Swiper>
  );
}