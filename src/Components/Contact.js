import React from 'react';
import { Email, Facebook, GitHub, Language, LinkedIn, Web, WhatsApp } from '@mui/icons-material';
import { Paper, Typography, Grid, Box, Button } from '@mui/material';
import { styled } from '@mui/system';


// Styled component for the Section
const Section = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  maxWidth: 600, // Increase the width
  margin: 'auto', // Center the component
  backgroundColor: theme.palette.background.default,
  boxShadow: theme.shadows[3],
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
  },
}));

// Styled component for icons with text
const ContactItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

function Contact({ navigate }) {
  return (
    <Section>
      <Typography variant="h5" component="h2" gutterBottom>
        Contact Me
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Connect with me on these platforms:
      </Typography>
      <Grid container spacing={2}>
      <Grid item xs={12}>
          <ContactItem>
            <Language color="action" fontSize="large" />
            <Typography variant="body1">My Site: <Button href='https://sankaranarayanank.onrender.com'>My profile</Button></Typography>
          </ContactItem>
        </Grid>
        <Grid item xs={12}>
          <ContactItem>
            <GitHub color="action" fontSize="large" />
            <Typography variant="body1">GitHub: <Button onClick={()=>{navigate('/contacts/github')}}>My profile</Button></Typography>
          </ContactItem>
        </Grid>
        <Grid item xs={12}>
          <ContactItem>
            <WhatsApp color="success" fontSize="large" />
            <Typography variant="body1">WhatsApp: <Button onClick={()=>{navigate('/contacts/whatsapp')}}>My profile</Button></Typography>
          </ContactItem>
        </Grid>
        <Grid item xs={12}>
          <ContactItem>
            <LinkedIn color="primary" fontSize="large" />
            <Typography variant="body1">LinkedIn: <Button onClick={()=>{navigate('/contacts/linkedin')}}>My profile</Button></Typography>
          </ContactItem>
        </Grid> 
        <Grid item xs={12}>
          <ContactItem>
            <Email color="white " fontSize="large" />
            <Typography variant="body1">Email: <Button onClick={()=>{navigate('/contacts/email')}}>My profile</Button></Typography>
          </ContactItem>
        </Grid>
      </Grid>
    </Section>
  );
}

export default Contact;
