import { useQuery } from "@tanstack/react-query";
import { BookCheck, FolderArchive, UserCheck } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from '../../components/ui/card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../../components/ui/empty";
import api from "../../lib/api/apiStore";
import useAuthStore from "../../lib/store/useStore";
import type { pln } from "./plan";

 


type enrol = {
  _id: string,
  subjectId: {
    _id: string,
    name: string
  };
  teacherId: {
    _id: string,
    firstname: string
  };
  grade: number;
  section: string;
  year: number;
}

// format function 

const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });

  return `${day} ${month}`;
};





const TeacherHomePage = () => {

  const { user } = useAuthStore()

  

  const navigate = useNavigate()


  // get teacher id 
  const { data: Teacher } = useQuery({
    queryKey: ['oneTeacher'],
    queryFn: async () => {
      const response = await api.get(`/teacher/${user?._id}`);
      //  console.log('teacher Data', response.data);
      return response.data
    }
  });

  // get all teacher subject 
  const { data: teacherEnroll } = useQuery({
    queryKey: ['teacherEnrol'],
    queryFn: async () => {
      const response = await api.get(`/teacherenrollment`);
      //  console.log('teacher Enrolled', response.data);
      return response.data
    }
  });

  // get total students 
  const { data: totalStd } = useQuery({
    queryKey: ['studentEnroll'],
    queryFn: async () => {
      const response = await api.get(`/teacherenrollment/student/${Teacher?._id}`);
      return response.data
    }
  });

  // get plan teacher 
  const { data: Plan } = useQuery({
    queryKey: ['plan'],
    queryFn: async () => {
      const response = await api.get(`/plan`);
      // console.log('plan tchr', response.data);
      return response.data
    }
  });

  // get 
  const teacherhisSubject = teacherEnroll?.filter((data: enrol) => data.teacherId?._id == Teacher?._id);

  

  return (
    <div className="bg-card min-h-screen p-6 ">
       <h1 className="text-2xl font-medium text-blue-600">Hello, {user?.name} 👏</h1>
      <div className="flex space-x-4 my-3">
        <Card className="w-full flex bg-linear-to-r from-rose-500 to-orange-400 rounded-lg">
          <CardContent className="flex flex-col text-white">
            <span className="text-xl font-medium">Subjects</span>
            <div className='flex justify-between'>
              <span className='text-xl font-bold'>{teacherhisSubject?.length}</span>
              <BookCheck className='size-10' />
            </div>
          </CardContent>
        </Card>

        <Card className="w-full flex bg-linear-to-r from-violet-500 to-blue-400 rounded-lg">
          <CardContent className="flex flex-col text-white">
            <span className="text-xl font-medium">Total Students</span>
            <div className='flex justify-between'>
              <span className='text-xl font-bold'>{totalStd?.[0]?.totalStudents ?? 0
                }</span>
              <UserCheck className='size-10' />
            </div>
          </CardContent>
        </Card>
      </div>
   
      <div>
        <h1 className="text-lg font-bold text-gray-700 my-3"> Subjects you teaches it </h1>
        {teacherhisSubject?.length === 0 ? (
          <Empty className="flex justify-center items-center">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderArchive />
              </EmptyMedia>
              <EmptyTitle> No subjects </EmptyTitle>
              <EmptyDescription>there is no subject you teaches  </EmptyDescription>
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
                      tchr.name
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">
                      subj.name
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">
                     grade
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">
                     section
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {teacherhisSubject?.map((item: enrol) => (
                    <tr
                      key={item._id}
                      className="hover:bg-blue-100 transition-colors duration-200 text-blue-500"
                    >
                      <td className="px-4 py-2 ">{item.teacherId.firstname}</td>
                      <td className="px-4 py-2 ">{item.subjectId.name}</td>
                      <td className="py-2 ">{item.grade}</td>
                      <td className="py-2 ">{item.section}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          </div>
        )
        }
      </div>
      {/*teacher weakly design  */}
      <div className="my-4">
        <h1 className="text-lg font-bold text-gray-700 my-3">Recent Plans </h1>
        {Plan?.length === 0 ? (
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
                      title
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">
                      Description
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Plan?.map((item: pln) => (
                    <tr
                      key={item._id}
                      className="hover:bg-blue-100 transition-colors duration-200 text-blue-500"
                    >
                      <td className="px-4 py-2 ">{item.title}</td>
                      <td className="px-4 py-2 ">{item.description}</td>
                      <td className="py-2 ">{formatDate(item.createdAt!)}</td>

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

export default TeacherHomePage