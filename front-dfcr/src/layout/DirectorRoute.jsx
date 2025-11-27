import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { fetchUserProfile } from '../api/User/currentUser';

const DirectorRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isDirector, setIsDirector] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const checkDirectorRole = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const userProfile = await fetchUserProfile();
                const hasDirectorRole = userProfile?.fonction?.toLowerCase() === 'directeur' ||
                    userProfile?.role?.toLowerCase() === 'directeur';

                setIsDirector(hasDirectorRole);
            } catch (error) {
                console.error('Erreur lors de la vérification du rôle:', error);
                setIsDirector(false);
            } finally {
                setLoading(false);
            }
        };

        checkDirectorRole();
    }, [token]);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <div>Chargement...</div>
            </div>
        );
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (!isDirector) {
        return (
            <Navigate
                to="/homepage"
                replace
                state={{
                    message: "Accès refusé. Seuls les directeurs peuvent accéder au tableau de bord."
                }}
            />
        );
    }

    return children;
};

export default DirectorRoute;