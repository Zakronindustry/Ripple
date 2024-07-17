import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import backgroundImage from '../assets/background.jpg'; // Ensure this path is correct

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-image: url(${backgroundImage});
  background-size: cover;
`;

const Header = styled.h1`
  font-size: 2em;
  color: #fff;
  margin: 20px 0;
  position: relative;
  z-index: 2;
`;

const CenterText = styled.h2`
  font-size: 5em;
  color: white;
  margin: 20px 0;
  position: relative;
  z-index: 2;
  animation: liquid 3s infinite;

  @keyframes liquid {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
`;

const Footer = styled.footer`
  font-size: 1em;
  color: #fff;
  margin: 20px 0;
  position: relative;
  z-index: 2;
`;

const CanvasContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const HomePage = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const buffer0Ref = useRef([]);
  const buffer1Ref = useRef([]);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctxRef.current = ctx;
    canvas.width = width;
    canvas.height = height;

    buffer0Ref.current = Array(width * height).fill(0);
    buffer1Ref.current = Array(width * height).fill(0);

    const disturb = (x, y, z) => {
      if (x < 2 || x > width - 2 || y < 1 || y > height - 2) return;
      const i = x + y * width;
      buffer0Ref.current[i] += z;
      buffer0Ref.current[i - 1] -= z;
    };

    const process = () => {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const img = ctx.getImageData(0, 0, width, height);
      const data = img.data;

      for (let i = width + 1; i < width * height - width - 1; i += 2) {
        for (let x = 1; x < width - 1; x++, i++) {
          buffer0Ref.current[i] =
            (buffer0Ref.current[i] +
              buffer0Ref.current[i + 1] +
              buffer0Ref.current[i - 1] +
              buffer0Ref.current[i - width] +
              buffer0Ref.current[i + width]) /
            5;
        }
      }

      for (let i = width + 1; i < width * height - width - 1; i += 2) {
        for (let x = 1; x < width - 1; x++, i++) {
          const waveHeight =
            (buffer0Ref.current[i - 1] +
              buffer0Ref.current[i + 1] +
              buffer0Ref.current[i + width] +
              buffer0Ref.current[i - width]) /
            2 -
            buffer1Ref.current[i];
          buffer1Ref.current[i] = waveHeight;

          const i4 = i * 4;

          if (waveHeight > 0.1) {
            data[i4 + 3] = 100; // Semi-transparent
          } else {
            data[i4 + 3] = 0; // Fully transparent
          }
        }
      }

      if (Math.random() < 0.03) { // Reduce the disturbance frequency
        disturb(
          Math.floor(Math.random() * width),
          Math.floor(Math.random() * height),
          Math.random() * 100 // Reduce the disturbance intensity
        );
      }

      let temp = buffer0Ref.current;
      buffer0Ref.current = buffer1Ref.current;
      buffer1Ref.current = temp;

      ctx.putImageData(img, 0, 0);

      requestAnimationFrame(process);
    };

    const handleClick = (e) => {
      const x = Math.floor((e.clientX / window.innerWidth) * width);
      const y = Math.floor((e.clientY / window.innerHeight) * height);
      disturb(x, y, 100); // Reduce the disturbance intensity on click
    };

    canvas.addEventListener('click', handleClick);
    requestAnimationFrame(process);

    return () => {
      cancelAnimationFrame(process);
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
    };
  }, [width, height]);

  return (
    <Container>
      <Header>Z A K R O N</Header>
      <CenterText>Gentle Waves of Peace</CenterText>
      <Footer>&copy; 2024 Zakron IT Industry. ALL RIGHTS RESERVED . PRANAY JAIN</Footer>
      <CanvasContainer>
        <canvas ref={canvasRef} />
      </CanvasContainer>
    </Container>
  );
};

export default HomePage;
