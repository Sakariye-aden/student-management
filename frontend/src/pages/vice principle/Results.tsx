import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import api from "../../lib/api/apiStore";

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
import toast from "react-hot-toast";
import { FolderArchive } from "lucide-react";
import { Button } from "../../components/ui/button";
import {  useNavigate } from "react-router";











interface StudentResult {
  studentId: number;
  studentName: string;
  totalScore: number;
  averageScore: number;
  rank: number;
}



 function VpResults() {

  const [term, setTerm] = useState<string | "">("");
  const [grade, setGrade] = useState("");
    const [section, setSection] = useState("");


    const navigate = useNavigate();

  // get total and Ranks 
  const { data: results, refetch} = useQuery({
    queryKey: ["results", term],
    queryFn: async () => {
       const response = await api.get(`/result?type=${term}&grade=${grade}&section=${section}`);
       console.log('Total result', response.data);

       return response.data
    },
    enabled: false, // only run when a term is selected
  });

 
  const Handlemidterm = ()=>{
    
     if(!grade || !section){
       toast.error('please select grade section');
       return 
     }

    setTerm("midterm");
     refetch();
  }
  const HandleFinalterm = ()=>{

     if(!grade || !section){
       toast.error('please select grade section');
       return 
     }
     
    setTerm("finalterm");
     refetch();
  }

  




  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Student Results</h1>
      <div className="flex flex-col gap-4  sm:flex-row  ">
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
            <SelectValue className="rounded-md" placeholder="Select Section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">A</SelectItem>
            <SelectItem value="B">B</SelectItem>
          </SelectContent>
        </Select>

        <button
          onClick={() => Handlemidterm()}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
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
      {/* Buttons */}

      {/* Results Table */}
      {results?.length == 0 ? (
        <div className="my-4">
          <Empty className="flex justify-center items-center">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderArchive />
              </EmptyMedia>
              <EmptyTitle> No Result here</EmptyTitle>
              <EmptyDescription>Please select the above form👆</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="flex gap-2">
                <Button onClick={()=>navigate('/vice-principal/enrolls')}>check here you enrolled correctly</Button>
              </div>
            </EmptyContent>
          </Empty>
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg shadow-md">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Rank
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Student Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Total Score
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Average Score
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((student: StudentResult) => (
                <tr key={student.studentId} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {student.rank}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {student.studentName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {student.totalScore}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {student.averageScore}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
 

export default VpResults