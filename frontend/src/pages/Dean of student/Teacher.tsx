
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import api from "../../lib/api/apiStore";

import toast from "react-hot-toast";
import { extractErrorMessages } from "../../utility/errorUtility";

interface formInfo {
  _id?:string;
  status? : string;
  userId?: string;
  firstname: string;
  lastname: string;
  gender: string;
  phone: number;
  qualification : string;
}


interface attdnc {
   date : string ;
   teachers:{
     teacherId: string ;
     status: string
   }[]
}




function TeacherAttendance() {
 
   const [page , setPage]= useState(1);
   
  const [dataNow, setDataNow] = useState("");
  const [teachers, setTeachers] = useState<formInfo[]>([]);

  
  
   const queryClient = useQueryClient()

  

//  get teacher in the teacher collection with pagination
  const { data } = useQuery({
    queryKey: ["teachers",page],
    queryFn: async () => {
         const response = await api.get(`/teacher/All?page=${page}&limit=10`);
         console.log("teacher pgn:",response.data);
         return response.data;
       },
        // enabled :false,
      placeholderData: (prev) => prev,   // keeps old data while fetching new
  });


  const loadTeachers = async () => {
     
      
    if ( !dataNow) {
       toast.error('you have to select date frist')
      return;
    }
    
    const initial = data?.data?.map((s:formInfo) => ({ ...s, status: "present" }));
    setTeachers(initial);
    
  };

  const updateStatus = (id: string, status: string) => {
    setTeachers((prev) =>
      prev.map((s) => (s._id === id ? { ...s, status } : s)),
    );
    
  };

  //get how many teachers are present || absent || excuted
const countPresent = teachers.filter((item)=> item.status == 'present').length;
const countabsent = teachers.filter((item)=> item.status == 'absent').length;
const countExcused = teachers.filter((item)=> item.status == 'excused').length;

  


 

  //  taking teacher attendance 
  const  teacherMutation = useMutation({
     mutationFn: async (userData: attdnc) => {
          const response = await api.post("/attendance/teacher", userData);
          return response.data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["studentsAttendance"] });
          toast.success(`you did attendance for teachers successfully `);
        },
        onError: (error) => {
          console.log("create user error", error);
          toast.error(extractErrorMessages(error));
        },
  })

  const saveAttendance = () => {
   
    if (!dataNow) {
       toast.error('you have to select date frist')
      return;
    };

      // teacher mutation
      teacherMutation.mutate({
         date : dataNow,
         teachers: teachers.map((s) => ({
          teacherId: s._id!,
          status: s.status!,
        })),
      })
     
  };

  // decrease
const Decrease = async ()=>{
    setPage((prev) => prev - 1);
    //  const { data } = await  refetch()
    const initial = data?.data?.map((s:formInfo) => ({ ...s, status: "present" }));
    setTeachers(initial);
}
// Increase
const Increase = async ()=>{
    setPage((prev) => prev + 1)
    //  const { data } = await  refetch()
    const initial = data?.data?.map((s:formInfo) => ({ ...s, status: "present" }));
    setTeachers(initial);
}




  return (
    <div className="p-6 space-y-6">
      <Card className="bg-card rounded-md shadow-md">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            type="date"
            value={dataNow}
            onChange={(e) => setDataNow(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground"
          />

          <Button onClick={loadTeachers} className="rounded-md">
            Load Teachers
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-card shadow-md rounded-md">
        <CardContent className="p-4">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">Teacher Attendance</h2>
            <div className="flex space-x-2">
                <button className="bg-green-500 text-white p-2 rounded-md text-lg">present:<span className="font-bold">{countPresent}</span> </button>
                <button className="bg-red-500 text-white p-2 rounded-md text-lg">absent:<span className="font-bold">{countabsent}</span> </button>
                <button className="bg-yellow-500 text-white p-2 rounded-md text-lg">excused:<span className="font-bold">{countExcused}</span> </button>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg shadow-md">
            <table className="min-w-full border border-gray-200 rounded-lg shadow-md ">
              <thead className="bg-gray-100 text-blue-600 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    #
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    mark
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {teachers?.map((teacher, index) => (
                  <tr
                    key={teacher._id}
                    className="hover:bg-blue-100 transition-colors duration-200 text-blue-600"
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{teacher.firstname}</td>
                    <td className="px-4 py-2 ">
                      <Select
                        value={teacher.status}
                        onValueChange={(value) =>
                          updateStatus(teacher._id!, value)
                        }
                      >
                        <SelectTrigger className="w-35">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="present">Present</SelectItem>
                          <SelectItem value="absent">Absent</SelectItem>
                          <SelectItem value="excused">Excused</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td>
                       {teacher.status == "present" ? '✅' : teacher.status == "absent" ? '❌' : '‼️'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
         <div className="flex justify-between mt-4">
              <button
                disabled={page === 1}
                onClick={() => Decrease()}
                className="px-4 py-2 bg-violet-600 text-white rounded-md disabled:opacity-50"
              >
                Prev
              </button>

              <span className="border text-center p-2 rounded-md">
                Page {data?.page} of {data?.totalPages}
              </span>

              <button
                disabled={page === data?.totalPages}
                onClick={() => Increase()}
                className="px-4 py-2 bg-gray-800 text-white rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
      <div className="space-x-2">
        <Button onClick={saveAttendance} className="rounded-md p-2 bg-violet-600 text-white">
          Save Attendance
        </Button>
      </div>
    </div>
  );
}

export default TeacherAttendance;
