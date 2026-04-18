import { useQuery } from '@tanstack/react-query';
import { FolderArchive, Loader, UserCheck, Users } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import api from '../../lib/api/apiStore';
import useAuthStore from '../../lib/store/useStore';


import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../../components/ui/empty";
import type { attdnc } from './Student';



const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });

  return `${day} ${month}`;
};






const DeanHomePage = () => {
  
   
      const { user } = useAuthStore()
   
      const navigate = useNavigate()
        
       //  get Total taechers and toatal students 
         const {data , isLoading } = useQuery({
           queryKey: ['dashboard'],
           queryFn : async () => {
              const response = await api.get('/dashboard');
               return response.data
            }
         });

         const {data:Attendance } = useQuery({
           queryKey: ['attendance'],
           queryFn : async () => {
              const response = await api.get('/attendance/student');
               console.log('std ateendance ', response.data);
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
             
           </div>
         </div>
         {/*last transations  */}
         <div className="bg-background p-4  mt-8 rounded-md">
           <h1 className="text-xl font-medium border-b pb-2 my-4">
             Recent attendances 
           </h1>
            {Attendance?.length === 0 ? (
                      <Empty className="flex justify-center items-center">
                        <EmptyHeader>
                          <EmptyMedia variant="icon">
                            <FolderArchive />
                          </EmptyMedia>
                          <EmptyTitle> No plans </EmptyTitle>
                          <EmptyDescription>there is no plan in this weak or month </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                          <div className="flex gap-2">
                            <Button onClick={()=>navigate('plan')}>write your plan</Button>
                          </div>
                        </EmptyContent>
                      </Empty>
                    ) : (
                      <div>
                        <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg shadow-md">
                          <table className="min-w-full border border-gray-200 rounded-lg shadow-md ">
                            <thead className="bg-gray-100 text-blue-600 sticky top-0">
                              <tr>
                                <th className="px-4 py-2 text-left text-sm font-semibold">
                                  #
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">
                                  grade
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">
                                  section
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">
                                  Date
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {Attendance?.map((item: attdnc, index:number) => (
                                <tr
                                  key={item._id}
                                  className="hover:bg-blue-100 transition-colors duration-200 text-blue-500"
                                >
                                  <td className="px-4 py-2 ">{index + 1}</td>
                                  <td className="px-4 py-2 ">{item.grade}</td>
                                  <td className="px-4 py-2 ">{item.section}</td>
                                  <td className="py-2 ">{formatDate(item.date)}</td>
                   
                                </tr>
                              ))}
                            </tbody>
                          </table>
            
                        </div>
                      </div>
                    )
                    }
         </div>
       </div>  
  )
}

export default DeanHomePage