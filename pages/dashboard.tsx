import { auth } from '@/src/firebase';
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';

const Dashboard = () => {
  const [user, authLoading] = useAuthState(auth);

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard