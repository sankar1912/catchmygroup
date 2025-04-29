import React from 'react';

const EmailContact = ({ navigate }) => {
  const handleNavigateToGithub = () => {
    navigate('/github');  // This will navigate to your GitHub profile inside the DashboardLayout
  };

  return (
    <div style={{ padding: '20px',justifyContent:'center', textAlign:'justify' }}>
      <h2>Contact Me</h2>
      <p>If you want to reach out, you can contact me via the following emails:</p>
      <ul>
        <li>Email: <a href="mailto:ksankar1912@gmail.com">ksankar1912@gmail.com</a></li>
        <li>Email: <a href="mailto:ksankar1912_bit26@mepcoeng.ac.in">ksankar1912_bit26@mepcoeng.ac.in</a></li>
      </ul>
      <button onClick={handleNavigateToGithub} style={{ marginTop: '20px', padding: '10px 15px', backgroundColor: '#0066cc', color: '#fff', border: 'none', borderRadius: '5px' }}>
        Look at My Profile
      </button>
    </div>
  );
};

export default EmailContact;
