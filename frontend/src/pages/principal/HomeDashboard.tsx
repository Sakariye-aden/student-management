import { useQuery } from '@tanstack/react-query';
import { BookOpen, Loader, UserCheck, Users } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import api from '../../lib/api/apiStore';
import useAuthStore from '../../lib/store/useStore';









const HomePrincipalDashboard = () => {


     const { user } = useAuthStore()
    
         
        //  total student tecaher 
          const {data , isLoading } = useQuery({
            queryKey: ['dashboard'],
            queryFn : async () => {
               const response = await api.get('/dashboard');
                return response.data
             }
          })
         
        //  get recent activities 
      const {data:recent  } = useQuery({
            queryKey: ['recent'],
            queryFn : async () => {
               const response = await api.get('/dashboard/recent');
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
      <h1 className="text-2xl font-medium text-blue-600">
        Hello, {user?.name} 👏
      </h1>

      <div>
        <div className="flex space-x-4 my-3">
          <Card className="w-full flex bg-linear-to-r from-rose-500 to-orange-400 rounded-lg">
            <CardContent className="flex flex-col text-white">
              <span className="text-xl font-medium">Total students</span>
              <div className="flex justify-between">
                <span className="text-xl font-bold">{data?.students}</span>
                <Users className="size-10" />
              </div>
            </CardContent>
          </Card>

          <Card className="w-full flex bg-linear-to-r from-violet-500 to-blue-400 rounded-lg">
            <CardContent className="flex flex-col text-white">
              <span className="text-xl font-medium">Total teachers</span>
              <div className="flex justify-between">
                <span className="text-xl font-bold">{data?.teachers}</span>
                <UserCheck className="size-10" />
              </div>
            </CardContent>
          </Card>
          <Card className="w-full flex bg-linear-to-r from-gray-600 to-green-500 rounded-lg">
            <CardContent className="flex flex-col text-white">
              <span className="text-xl font-medium">Total subjects</span>
              <div className="flex justify-between">
                <span className="text-xl font-bold">{data?.subjects}</span>
                <BookOpen className="size-10" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* recent activies */}
      <h1 className="text-xl font-medium border-b pb-2">Recent Activities</h1>
      <div className="grid  md:grid-cols-2 gap-6 mt-6">
        {/* recent student */}
        <div className="bg-white rounded-xl shadow p-5">
          <h1 className="text-lg font-semibold mb-3 text-blue-600">
            Recent students{" "}
          </h1>
          <ul className="space-y-3 max-h-64 overflow-y-auto">
            {recent?.student?.map((item: any) => (
              <li
                key={item._id}
                className="flex justify-between items-center border-b pb-2"
              >
                <span>
                  🧑‍🎓 {item.firstname}
                </span>
                <span className="text-gray-500">registered</span>
                <span className="text-sm text-gray-400">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
        {/* recent Teachers  */}
        <div className="bg-white rounded-xl shadow p-5">
          <h1 className="text-lg font-semibold mb-3 text-blue-600">
            Recent teacher{" "}
          </h1>
          <ul className="space-y-3 max-h-64 overflow-y-auto">
            {recent?.teacher?.map((item: any) => (
              <li
                key={item._id}
                className="flex justify-between items-center border-b pb-2"
              >
                <span>
                  🧑‍💻 {item.firstname}
                </span>
                <span className="text-gray-500">registered</span>
                <span className="text-sm text-gray-400">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
        {/* recent plans  */}
        <div className="bg-white rounded-xl shadow p-5">
          <h1 className="text-lg font-semibold mb-3 text-blue-600">
            Recent teacher plans{" "}
          </h1>
          <ul className="space-y-3 max-h-64 overflow-y-auto">
            {recent?.plan?.map((item: any) => (
              <li
                key={item._id}
                className="flex justify-between items-center border-b pb-2"
              >
                <span>
                  📚 {item.title}
                </span>
                <span className="text-gray-500">registered</span>
                <span className="text-sm text-gray-400">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default  HomePrincipalDashboard;