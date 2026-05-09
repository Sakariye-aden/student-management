import { useQuery } from "@tanstack/react-query";
import { FolderArchive, Loader } from "lucide-react";
import api from "../../lib/api/apiStore";
import useAuthStore from "../../lib/store/useStore";

import { useState } from "react";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "../../components/ui/empty";


type subjInfo = {
    score :number
    subjectName : string
    _id : string
}













const HomeDashboardStudent = () => {

    const [term , setTerm ]= useState("")

  const { user } = useAuthStore()
    
    // get one student info
      const { data: studentId, isLoading: studentLoad } = useQuery({
        queryKey: ['student'],
        queryFn: async () => {
          const response = await api.get(`/student/${user?._id}`);
       
          return response.data
        }
      });

    // get all your result  
      const { data: result , isLoading : resultLoad,  } = useQuery({
        queryKey: ['result',studentId, term],
        queryFn: async () => {
          const response = await api.get(`/result/student?id=${studentId?._id}&type=${term}`);
          
          console.log("term ",response.data);
          return response.data
        }
      }); 


      if(studentLoad || resultLoad){
        return (
         <div className='h-screen flex justify-center items-center'>
            <Loader className='animate-spin text-3xl' />
         </div>
        )
      }

    //   midterm
       const Handlemidterm =  ()=>{
          
          setTerm("midterm");
          //  refetch()
        }
    
    // finalterm
        const HandleFinalterm = ()=>{
          
          setTerm("finalterm");
          //  refetch();
        }
  
         console.log('term ',term)

  return (
    <div className="bg-card h-min-screen p-4">
      <h1 className="text-2xl font-medium text-blue-600">
        Hello, {user?.name} 👏
      </h1>
      <div className="py-6">
        <p className="text-violet-700 font-bold">
          Name : {user?.name} {studentId?.lastname}
        </p>
        <p className="text-gray-700 font-bold">Grade: {studentId?.grade}</p>
        <p className="text-gray-700 font-bold">section: {studentId?.section}</p>
      </div>

      <div className="p-4 my-2">
        <button
          onClick={() => Handlemidterm()}
          className="px-3 py-1 m-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          midterm
        </button>
        <button
          onClick={() => HandleFinalterm()}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          finalterm
        </button>
      </div>
      {result?.length === 0 ? (
        <Empty className="flex justify-center items-center">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderArchive />
            </EmptyMedia>
            <EmptyTitle> No result Found </EmptyTitle>
            <EmptyDescription>
              please wait untill the teacher's is submitted 📚
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <p className="p-4 rounded-md bg-violet-500 text-white font-bold">
                when the result is submitted you will see here have a patient ✅
              </p>
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
                    subject
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    score
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {result?.map((item: subjInfo) => (
                  <tr
                    key={item._id}
                    className="hover:bg-blue-100 transition-colors duration-200 text-blue-500"
                  >
                    <td className="px-4 py-2 ">{item.subjectName}</td>
                    <td className="px-4 py-2 ">{item.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

}

export default HomeDashboardStudent