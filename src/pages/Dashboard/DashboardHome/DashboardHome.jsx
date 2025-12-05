import React from 'react';
import useUserRole from '../../../hooks/useUserRole';
import Loading from '../../../hooks/Loading';
import AdminHome from './AdminHome';
import StudentHome from './StudentHome';
import Forbidden from '../../Forbidden/Forbidden';
 

const DashboardHome = () => {
    const {role,RoleLoading}= useUserRole();
    if(RoleLoading){
        return <Loading></Loading>
    }
    if(role==='admin'){
        return <AdminHome></AdminHome>
    }
    if(role==='student'){
        return <StudentHome></StudentHome>
    }
    return  <Forbidden></Forbidden> ;
};

export default DashboardHome;