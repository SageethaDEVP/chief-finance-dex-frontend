import React from 'react';
import styled from 'styled-components';

export const Container = styled.div`
width: 100%;
max-width: 600px;
margin: 0 auto;
padding: 0 20px;
border-radius: 20px;
display: flex;
justify-content: space-between;

@media screen and (max-width: 600px) {
  .container {
    flex-direction: column; 
    align-items: center;
  }
  `;
