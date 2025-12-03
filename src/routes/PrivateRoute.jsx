import React from 'react';
import useAuth from '../hooks/useAuth';
import Loading from '../hooks/Loading';
import { Navigate } from 'react-router';

const PrivateRoute = ({children}) => {
    const {user, loading}= useAuth();
    if(loading){
        return <Loading/>;
    }
    if(!user){
       return <Navigate state={{ from: location.pathname }} to="/login"></Navigate>;
    }
    return  children;
};

export default PrivateRoute; 