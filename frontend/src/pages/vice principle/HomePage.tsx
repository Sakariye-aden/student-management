import { Card, CardContent } from '../../components/ui/card';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../../lib/store/useStore';
import api from '../../lib/api/apiStore';
import { BookOpen, Loader,  UserCheck,  Users } from 'lucide-react';










const HomePage = () => {

   const { user } = useAuthStore()

     
    //  transactionQuery
      const {data , isLoading } = useQuery({
        queryKey: ['trans'],
        queryFn : async () => {
           const response = await api.get('/dashboard');
            return response.data
         }
      })
     

       if(isLoading){
       return (
          <div className='h-screen flex justify-center items-center'>
             <Loader className='animate-spin text-3xl' />
          </div>
       )
    }

  


  return (
    
     <div className="bg-card h-min-screen p-4">
      <h1 className="text-2xl font-medium text-blue-600">Hello, {user?.name} 👏</h1>
      {/* cards */}
      <div>
        <div className="flex space-x-4 my-3">
          <Card className="w-full flex bg-linear-to-r from-rose-500 to-orange-400 rounded-lg">
            <CardContent className="flex flex-col text-white">  
              <span className="text-xl font-medium">Total students</span>
              <div className='flex justify-between'>
                 <span className='text-xl font-bold'>{data?.students}</span>
                 <Users className='size-10'/>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full flex bg-linear-to-r from-violet-500 to-blue-400 rounded-lg">
            <CardContent className="flex flex-col text-white">  
              <span className="text-xl font-medium">Total teachers</span>
              <div className='flex justify-between'>
                 <span className='text-xl font-bold'>{data?.teachers}</span>
                 <UserCheck className='size-10'/>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full flex bg-linear-to-r from-gray-600 to-green-500 rounded-lg">
            <CardContent className="flex flex-col text-white">  
              <span className="text-xl font-medium">Total subjects</span>
              <div className='flex justify-between'>
                 <span className='text-xl font-bold'>{data?.subjects}</span>
                 <BookOpen className='size-10'/>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/*last transations  */}
      <div className="bg-background p-4 shadow-lg mt-8 rounded-md">
        <h1 className="text-xl font-medium border-b pb-2">
          Recent Transactions
        </h1>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vitae natus inventore aliquid! Fugit, neque hic doloremque, architecto sapiente rem sit aut velit impedit odio incidunt nulla dolorum placeat illum veritatis vero a similique tenetur.</p>
      </div>
    </div>    
  )
}

export default HomePage