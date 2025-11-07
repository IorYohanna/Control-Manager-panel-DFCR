import React from 'react'
import { Mail } from 'lucide-react';

const EmailLogin = ({handleLogin}) => {

    return (
        <div className='w-full min-h-screen bg-linear-to-r from-[#6b7ea0] to-[#f5ece3] flex items-center justify-center p-4'>
            <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full relative overflow-hidden">
                
                {/* 🎨 Dégradé léger en arrière-plan */}
                <div className="absolute top-0 left-0 w-full h-3/5 bg-linear-to-b from-[#2d466e]/30 to-transparent rounded-b-3xl"></div>

                {/* Logo + titre */}
                <div className="text-center mb-10 relative z-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-r from-[#2d466e] to-[#73839e] rounded-full mb-4 shadow-lg">
                        <Mail className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-[#2d466e] mb-2">Gmail</h1>
                    <p className="text-[#73839e] ">Connectez-vous avec votre compte Google</p>
                    <p className="text-[#73839e]">Pour voir vos récentes emails</p>
                </div>
                
                {/* Bouton Google */}
                <button
                onClick={handleLogin}
                className="w-full bg-linear-to-r from-[#2d466e] to-[#73839e] text-white py-3 px-6 rounded-xl font-semibold hover:from-[#2d466e]/90 hover:to-[#73839e]/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-3 relative z-10"
                >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Se connecter avec Google
                </button>

                {/* Note de sécurité */}
                <div className="mt-6 text-center text-sm text-[#73839e] relative z-10 font-eirene">
                <p>Accédez à vos emails Gmail en toute sécurité</p>
                </div>
            </div>
            </div>

    )
}

export default EmailLogin