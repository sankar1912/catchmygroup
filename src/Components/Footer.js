import React from 'react';
import { Box, Typography, Link } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        padding: 2,
        backgroundColor: '#333',
        color: 'white',
        textAlign: 'center',
        mt: 5,
        borderTop: '1px solid #444',
        width:'100%'
      }}
    >
      <Typography variant="body2" sx={{ mb: 1 }}>
        &copy; {new Date().getFullYear()} CatchMyGroup. All Rights Reserved.
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Developed by{' '}
        <Link href="https://sankaranarayanank.onrender.com" target="_blank" color="inherit">
          Sankara Narayanan K B.Tech IT
        </Link>
        .
      </Typography>
      <Typography variant="body2">
        This app was developed with an open-source design and layout from{' '}
        <Link href="https://mui.com/" target="_blank" color="inherit">
          Material UI
        </Link>
        .
      </Typography>
    </Box>
  );
}

export default Footer;
