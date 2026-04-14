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
  age: number;
  grade: number;
  section: string;
  parentname: string;
  phone: number;
  relationship: string;
}


interface attdnc {
   grade : number;
   section : string ;
   date : string ;
   students:{
     studentId: string ;
     status: string
   }[]
}



function StudentAttendance() {


  const [grade, setGrade] = useState("");
  const [section, setSection] = useState("");
  const [dataNow, setDataNow] = useState("");
  const [students, setStudents] = useState<formInfo[]>([]);


  
   const queryClient = useQueryClient()

  // load students 
  //  get students in the student collection
  const {  refetch} = useQuery({
    queryKey: ["student"],
    queryFn: async () => {
      const response = await api.get(`/student/user?grade=${grade}&section=${section}`);
        // console.log('data Students Grade', response.data);
      return response.data;
    },
    enabled :false
  });





  const loadStudents = async () => {
     
      
    if (!grade || !section || !dataNow) {
       toast.error('you have to select grade and section and date')
      return;
    }
     setStudents([]); // ✅ clear old data
     const { data } = await  refetch()
    const initial = data?.map((s:formInfo) => ({ ...s, status: "present" }));
    setStudents(initial);
    
  };

  const updateStatus = (id: string, status: string) => {
    setStudents((prev) =>
      prev.map((s) => (s._id === id ? { ...s, status } : s)),
    );
  };
 
  //get how many teachers are present || absent || excuted
const countPresent = students.filter((item)=> item.status == 'present').length;
const countabsent = students.filter((item)=> item.status == 'absent').length;
const countExcused = students.filter((item)=> item.status == 'excused').length;



  //  taking student attendance 
  const studentMutation = useMutation({
     mutationFn: async (userData: attdnc) => {
          const response = await api.post("/attendance/student", userData);
          return response.data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["studentsAttendance"] });
          toast.success(`you did attendance for grade ${grade} section${section} successfully `);
        },
        onError: (error) => {
          console.log("create user error", error);
          toast.error(extractErrorMessages(error));
        },
  })

  const saveAttendance = () => {
   
    if (!grade || !section || !dataNow) {
       toast.error('you have to select grade and section and date')
      return;
    }
   
      studentMutation.mutate({
         grade : Number(grade),
         section : section,
         date : dataNow,
         students: students.map((s) => ({
          studentId: s._id!,
          status: s.status!,
        })),
      })
     
     
  };




  return (
    <div className="p-6 space-y-6"> 
      <h1 className="text-lg font-bold font-sans text-blue-600">Taking student attendances </h1>
      <Card className="bg-card rounded-md shadow-md">
      
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select onValueChange={setGrade}>
            <SelectTrigger className="w-full rounded-md border border-input bg-background px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground">
              <SelectValue placeholder="Select Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="8">Grade 8</SelectItem>
              <SelectItem value="7">Grade 7 </SelectItem>
              <SelectItem value="6">Grade 6</SelectItem>
              <SelectItem value="5">Grade 5</SelectItem>
              <SelectItem value="4">Grade 4</SelectItem>
              <SelectItem value="3">Grade 3</SelectItem>
              <SelectItem value="2">Grade 2</SelectItem>
              <SelectItem value="1">Grade 1</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setSection}>
            <SelectTrigger className="w-full rounded-md border border-input bg-background px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground">
              <SelectValue
                className="rounded-md"
                placeholder="Select Section"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="B">B</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={dataNow}
            onChange={(e) => setDataNow(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground"
          />

          <Button onClick={loadStudents} className="rounded-md">
            Load Students
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-card shadow-md rounded-md">
        <CardContent className="p-4">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">Student Attendance</h2>
             <div className="flex space-x-2">
                <button className="bg-green-500 text-white p-2 rounded-md text-lg">present:<span className="font-bold">{countPresent}</span> </button>
                <button className="bg-red-500 text-white p-2 rounded-md text-lg">absent:<span className="font-bold">{countabsent}</span> </button>
                <button className="bg-yellow-500 text-white p-2 rounded-md text-lg">excuted:<span className="font-bold">{countExcused}</span> </button>
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
                    Mark
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students?.map((student, index) => (
                  <tr
                    key={student._id}
                    className="hover:bg-blue-100 transition-colors duration-200 text-blue-600"
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{student.firstname}</td>
                    <td className="px-4 py-2 ">
                      <Select
                        value={student.status}
                        onValueChange={(value) =>
                          updateStatus(student._id!, value)
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
                       {student.status == "present" ? '✅' : student.status == "absent" ? '❌' : '‼️'}
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <div className="space-x-2">
        
        <Button onClick={saveAttendance} className="rounded-md">
          Save Attendance
        </Button>
      </div>
    </div>
  );
}

export default StudentAttendance;
