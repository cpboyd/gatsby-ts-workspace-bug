import React from 'react';

export const onRenderBody = ({ setHeadComponents }) => {
  const headComp = [
    <link
      key="material"
      rel="stylesheet"
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
    />,
  ];
  setHeadComponents(headComp);
};
