import { useQuery } from '@tanstack/react-query'
import { Loader } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import useAuthStore from '../../lib/store/useStore';
import api from '../../lib/api/apiStore';
import { Navigate , useLocation, } from 'react-router';

// abdalla 

type ProtectedRouteProps = {
  children: ReactNode;
};



const ProtectedRoute = ({ children } : ProtectedRouteProps) => {

    const { user, setAuth, clearAuth  } = useAuthStore();

    const location = useLocation();


    const { data, error, isLoading, isError, isSuccess } = useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const response = await api.get('/Auth/me');
            return response.data
        },
        retry: 1
    })

    // error case

    useEffect(() => {

        if (error) {
            clearAuth();
            console.log("error User", error);
        }

    }, [isError, error, clearAuth]);

    // success case
    useEffect(() => {
        if (isSuccess && data) {
            setAuth(data)
            console.log('Data user', data);
        }

    }, [isSuccess, data, setAuth])


    if (isLoading) {
        return (
            <div className='flex h-screen items-center justify-center'>
                <Loader className='animate-spin' />
            </div>
        )
    }


    if (isError && !user) {
        console.log("error here", error);
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // if (!user) {
    //     console.log("user not found", user);
    //     return <Navigate to="/login" state={{ from: location }} replace />
    // }

    return children
}

export default ProtectedRoute