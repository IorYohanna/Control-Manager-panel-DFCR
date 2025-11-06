import React,{useState} from 'react'
import EmailDisplay from './EmailDisplay'
import GmailLogin from './GmailLogin';

const EmailPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLoginSuccess = (token) => {
        setIsLoggedIn(!!token);
    };
    return (
        <div className='w-full bg-linear-to-tr from-[#73839E] to-[#5a729b] shadow-[0_4px_15px_rgba(0,0,0,0.08)] min-h-screen overflow-hidden'>
            {!isLoggedIn ? (
                <GmailLogin onLoginSuccess={handleLoginSuccess} />
            ) : (
                <EmailDisplay/> 
            )}
        </div>
        
    )
}

export default EmailPage