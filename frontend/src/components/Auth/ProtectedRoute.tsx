import { useQuery } from '@tanstack/react-query'
import { Loader } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { Navigate } from 'react-router'
import useAuthStore from '../../lib/store/useStore';
import api from '../../lib/api/apiStore';

type ProtectedRouteProps = {
  children: ReactNode;
};


const ProtectedRoute = ({ children } : ProtectedRouteProps) => {

    const { user, setAuth, clearAuth  } = useAuthStore();


    const { data, error, isLoading, isError, isSuccess } = useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const response = await api.get('/auth/me');
            return response.data
        },
        retry: 1
    })

    // error case

    useEffect(() => {

        if (error) {
            clearAuth();
        }

    }, [isError, error, clearAuth]);

    // success case
    useEffect(() => {
        if (isSuccess && data) {
            setAuth(data)
        }

    }, [isSuccess, data, setAuth])


    if (isLoading) {
        return (
            <div className='flex h-screen items-center justify-center'>
                <Loader className='animate-spin' />
            </div>
        )
    }


    if (isError) {
        console.log("error here", error);
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (!user) {
        console.log("user not found", user);
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children
}

export default ProtectedRoute