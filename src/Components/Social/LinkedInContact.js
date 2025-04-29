import React from 'react'

const LinkedInContact = ({navigate}) => {
  return (
    <div style={{ padding: '20px',justifyContent:'center', textAlign:'justify' }}>
      <h2>Contact Me</h2>
      <p>If you want to reach out, you can contact me via the following LinkedIn:</p>
      <ul>
        <li>Link: <a href="https://www.linkedin.com/in/sankara-narayanank/">https://www.linkedin.com/in/sankara-narayanank/</a></li>

      </ul>
      <button  style={{cursor:'pointer', marginTop: '20px', padding: '10px 15px', backgroundColor: '#0066cc', color: '#fff', border: 'none', borderRadius: '5px' }}>
        <a href="https://www.linkedin.com/in/sankara-narayanank/" style={{textDecoration:'none',color:'white'}}><span>Look at My Profile</span></a>
      </button>
    </div>
  )
}

export default LinkedInContact