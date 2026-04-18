import   { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../../components/ui/empty";
import api from "../../lib/api/apiStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuthStore from "../../lib/store/useStore";
import { FolderArchive } from "lucide-react";
import { extractErrorMessages } from "../../utility/errorUtility";



type FormType = {
  subjectId?: string;
};



type subj = {
  _id :string,
  name : string
}


type Inpt = {
  score : number,
}
interface Enrollment {
  _id?: string;
  grade: string;
  section: string;
  subjectId: string;
  year: number;
  studentId: {
    _id: string;
    firstname: string;
  };
}

type rslt = {
   subjectId: string;
    studentId: string;
    teacherId: string;
    score : number ;
    term : string ;
    year : number ;
}


type StudentInputs = Record<string, Inpt>; // key = student._id








function TeacherResult() {

   const { user } = useAuthStore()

  const [grade, setGrade] = useState("");
  const [section, setSection] = useState("");
  const [term, setTerm] = useState("");
  const [formData, setFormData ]= useState<FormType>({})
  const [students , setStudents ]= useState([]);
  const [Score , setScore ]=useState(0)
  
  const [inputData, setInputData ]=useState<StudentInputs>({})

   //  get subjects in the subject collection
  const { data} = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const response = await api.get(`/subject`);
      // console.log("subjects data:",response.data);
      return response.data;
    },
  });

  // get student that in rolled that subject 

   const {  refetch} = useQuery({
     queryKey:['studentenroll'],
     queryFn : async ()=>{
       const response = await api.get(`/studentenrollment/student?subjectId=${formData?.subjectId}&grade=${Number(grade)}&section=${section}`);
      //  console.log('studentId :', response.data);
       return response.data
     }, 
     enabled : false
   })


  // handle change

  const handleChange = (studentId: string, field: keyof Inpt, value: number) => {
  setInputData(prev => ({
    ...prev,
    [studentId]: {
      ...prev[studentId],
      [field]: value,
    },
  }));
  setScore(value)
};
  
   //handle select 
   const handleSelect = (field: keyof FormType) => (value: string) => {
   setFormData((prev) => ({
       ...prev,
      [field]: value,
    }));
  };

  // load students 
  const loadStudents = async ()=>{
   
      if(!formData ||  !grade || !section){
        toast.error('please select the subject grade section ')
        return
      }
     
     const { data } = await  refetch();

      setStudents(data)
  }

  // insert result 
  const resultMutation = useMutation({
    mutationFn : async (data:rslt)=>{
       const response = await api.post('/result', data);
       return response.data
    },
    onSuccess : ()=>{
      toast.success('you have saved result successfully')
    },
    onError : (err)=>{
       toast.error(extractErrorMessages(err))
    }
  })

  //  handle save 
  const handleSave = (studentId : string) => {
    

     if(!term || !Score){
         toast.error('please select term and enter score ')
        return
     }
     
    //  register result 
    resultMutation.mutate({
      subjectId : formData.subjectId as string,
      studentId : studentId,
      teacherId : user?._id as string,
       score :Number(Score),
       term: term,
       year :  2026
    })

    

    setTerm('');
    setScore(0)
  };

   
  // finding subject name
 const SubjectName = data?.find((subject:subj)=> subject._id === formData.subjectId )




  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Insert Student Results
      </h1>

      {/* choose this options  */}
      <Card className="bg-card rounded-md shadow-md my-2">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select onValueChange={handleSelect("subjectId")}>
            <SelectTrigger className="w-full rounded-md border border-input bg-background px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground">
              <SelectValue placeholder="Select subjects" />
            </SelectTrigger>
            <SelectContent>
              {data?.map((subject: subj) => (
                <SelectItem key={subject._id} value={subject._id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

          <Button onClick={loadStudents} className="py-4 rounded-lg">
            Load Students
          </Button>
        </CardContent>
      </Card>
      {grade && section && SubjectName && (
        <div className="bg-card p-4 rounded-lg shadow-md">
          {SubjectName && (
            <h2 className="text-gray-700 font-bold text-lg my-2">
              {SubjectName?.name}
            </h2>
          )}
          <p>
            {grade}th Grade - section {section}
          </p>
        </div>
      )}
      {/* Table */}
      {students?.length == 0 ? (
        <Empty className="flex justify-center items-center">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderArchive />
            </EmptyMedia>
            <EmptyTitle> No student Found please select the above form 👆 </EmptyTitle>
            <EmptyDescription>No student enrolled this {SubjectName?.name}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <p className="p-4 rounded-md bg-violet-500 text-white font-bold">please inform vice principal to this information </p>
            </div>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="bg-white rounded-2xl mt-6 shadow-lg overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg shadow-md ">
            <thead className="bg-gray-200 text-left text-blue-600 sticky top-0">
              <tr>
                <th className="px-4 py-2  text-sm font-semibold">S.Name</th>
                <th className="px-4 py-2 text-sm font-semibold">term</th>
                <th className="px-4 py-2  text-sm font-semibold">Score</th>
                <th className="px-4 py-2  text-sm font-semibold">Status</th>
                <th className="px-4 py-2  text-sm font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {students?.map((student: Enrollment) => {
                const studentInputs = inputData[student.studentId._id] || {
                  score: 0,
                };

                return (
                  <tr
                    key={student._id}
                    className="hover:bg-blue-50 transition-colors duration-200"
                  >
                    <td className="px-4 py-2 font-medium text-gray-700">
                      {student?.studentId?.firstname}
                    </td>
                    <td className="px-4 py-2 font-medium text-blue-500">
                      <Select onValueChange={setTerm}>
                        <SelectTrigger className="rounded-md border border-input bg-background px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground">
                          <SelectValue placeholder="Select term" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="midterm">midterm</SelectItem>
                          <SelectItem value="finalterm">finalterm</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>

                    <td className="px-4 py-2">
                      <input
                        type="number"
                        name="score"
                        value={studentInputs.score}
                        onChange={(e) =>
                          handleChange(
                            student?.studentId?._id,
                            "score",
                            Number(e.target.value),
                          )
                        }
                        min={0}
                        className="w-24 p-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </td>

                    <td className="px-4 py-2 font-semibold text-blue-600">
                      {studentInputs.score >= 50 ? (
                        <span>pass</span>
                      ) : (
                        <span>fail</span>
                      )}
                    </td>

                    <td className="px-4 py-2 font-semibold text-blue-600">
                      <button
                        onClick={() => handleSave(student?.studentId?._id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition"
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      
    </div>
  );
}

export default TeacherResult