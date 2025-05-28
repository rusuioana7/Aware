import React from 'react';
import {FaTwitter, FaLinkedin, FaInstagram, FaGithub} from 'react-icons/fa';

const Footer: React.FC = () => {
    return (
        <footer style={{
            backgroundColor: '#031A6B',
            padding: '40px 20px',
            borderTop: '1px solid #E0E0E0',
            marginTop: '40px',
            fontSize: '14px',
            color: '#F8F9FA'
        }}>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                maxWidth: '1200px',
                margin: '0 auto',
                gap: '40px'
            }}>
                <div style={{flex: '1 1 200px'}}>
                    <h2 style={{color: '#F8F9FA', marginBottom: '12px'}}>AWARE</h2>
                    <p>Stay informed. Stay Aware.</p>
                </div>

                <div style={{flex: '1 1 150px'}}>
                    <ul style={{listStyle: 'none', padding: 0}}>
                        <li><a href="/about" style={linkStyle}>About</a></li>
                        <li><a href="/contact" style={linkStyle}>Contact</a></li>
                        <li><a href="/privacy" style={linkStyle}>Privacy Policy</a></li>
                        <li><a href="/terms" style={linkStyle}>Terms of Service</a></li>
                    </ul>
                </div>

                <div style={{flex: '1 1 150px'}}>
                    <h4 style={{color: '#F8F9FA', marginBottom: '10px'}}>Follow Us</h4>
                    <div style={{display: 'flex', gap: '12px'}}>
                        <a href="https://twitter.com" style={iconStyle}><FaTwitter size={20}/></a>
                        <a href="https://linkedin.com" style={iconStyle}><FaLinkedin size={20}/></a>
                        <a href="https://instagram.com" style={iconStyle}><FaInstagram size={20}/></a>
                        <a href="https://github.com" style={iconStyle}><FaGithub size={20}/></a>
                    </div>
                </div>
            </div>

            <div style={{textAlign: 'center', marginTop: '40px', fontSize: '13px', color: '#F8F9FA'}}>
                © {new Date().getFullYear()} AWARE. All rights reserved.
            </div>
        </footer>
    );
};

const linkStyle: React.CSSProperties = {
    color: '#F8F9FA',
    textDecoration: 'none',
    display: 'block',
    marginBottom: '6px',
    transition: 'color 0.2s ease-in-out',
};
const iconStyle: React.CSSProperties = {
    color: '#F8F9FA',
    transition: 'color 0.2s ease',
};

export default Footer;
