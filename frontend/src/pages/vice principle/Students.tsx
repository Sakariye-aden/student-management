import { Button } from "../../components/ui/button";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { FolderArchive, Loader, Pencil, SquarePen, Trash } from "lucide-react";

import api from "../../lib/api/apiStore";
import toast from "react-hot-toast";
import { extractErrorMessages } from "../../utility/errorUtility";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";

export interface Usr {
  _id: string;
  name: string;
  email: string;
  password: string;
  role:
    | "student"
    | "teacher"
    | "principle"
    | "vice principle"
    | "dean of student"; // restrict to known
}

interface formInfo {
  userId? : string
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









const VpStudents = () => {



    const queryClient = useQueryClient();

  
  const [isEdit, setisEdit] = useState<Usr | null>(null);
  const [isDelete, setIsDelete] = useState<Usr | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [formData, setFormData] = useState<formInfo>({
    firstname: "",
    lastname: "",
    gender: "",
    age: 1,
    grade: 1,
    section: "",
    parentname: "",
    phone: 1,
    relationship: "",
  });

  // const queryClient = useQueryClient()

  const HandleOpen = () => {
    setIsOpen(false);
    setisEdit(null);
    setIsDelete(null);
    setIsDeleteOpen(false);
  };

  // handle Edit
  const handleEdit = (item: Usr) => {
    setisEdit(item);
  

    // //  update form
    //   setFormData({
    //     firstname: formData.firstname ,
    //     lastname: formData.lastname,
    //     gender: formData.gender,
    //     age: formData.age,
    //     grade: 1,
    //     section: "",
    //     parentName: "",
    //     phone: 1,
    //     relationship: "",
    //  })
  };
 
  // handle Delete
  const handleDelete = (item: Usr) => {
    setIsDelete(item);

    console.log("user item delete", item);
  };

 // handle change 
     const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
         const {name , value }= e.target;
          setFormData({...formData , [name]: value })
      }
   // handle select 
  const handleSelect = (field: keyof formInfo) =>(value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // register student 
   const createMutation = useMutation({
          mutationFn : async (userData:formInfo) => {
             const response = await api.post('/student', userData);
              return response.data
           },
           onSuccess : ()=>{
              //  queryClient.invalidateQueries(['trans'])
               toast.success('student registered successfully.')
               setIsOpen(false)
           },
           onError: (error)=>{
             console.log("create user error", error);
              toast.error(extractErrorMessages(error))
           }
       })
  

//  edit Students info 



// delete student 



  // get user whose role is student  and then register 
  const { data: StudentRole } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get("/Auth/all");
      return response.data;
    },
  });

  //  console.log("data Users ", data);
  //  console.log("error users", error);

  const filteredUser = StudentRole?.filter((u: Usr) => u.role == "student");

   
  // handleSubmit

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
      
      e.preventDefault();
    
       if(!formData.firstname || !formData.lastname ||!formData.gender || !formData.age || !formData.gender || !formData.parentname || !formData.phone || !formData.relationship ){
          console.log('errors happaned.');
          toast.error('all fields are required * ')
          return
       }

      //  prepare your data 
      // const userData = {
      //       userId : isEdit?._id,
      //       firstname: formData.firstname.trim(),
      //       lastname: formData.lastname.trim(),
      //       gender: formData.gender,
      //       age: Number(formData.age),
      //       grade: Number(formData.grade),
      //       section: formData.section.trim(),
      //       parentname: formData.parentname.trim(),
      //       phone: Number(formData.phone),
      //       relationship: formData.relationship.trim(),
      //   }

      // register User 

        createMutation.mutate({
            userId : isEdit?._id,
            firstname: formData.firstname.trim(),
            lastname: formData.lastname.trim(),
            gender: formData.gender,
            age: Number(formData.age),
            grade: Number(formData.grade),
            section: formData.section.trim(),
            parentname: formData.parentname.trim(),
            phone: Number(formData.phone),
            relationship: formData.relationship.trim(),
        })


        // clear form 
        setFormData({
           firstname: "",
            lastname: "",
            gender: "",
            age: 1,
            grade: 1,
            section: "",
            parentname: "",
            phone: 1,
            relationship: "",
       })


  }




















  return (
    <div className="bg-card h-screen p-6 ">
      <h1 className="text-2xl font-medium py-2">Student management system</h1>
      <div className="flex justify-between items-center my-2">
        <p className="font-medium">
          View and Manage all your students that you've added to your account
        </p>
        <Button
          className="cursor-pointer p-2 rounded-md"
          onClick={() => setIsOpen(true)}
        >
          Register student
        </Button>
      </div>
      <h1>when the student logged in and we don't register more details</h1>
      {filteredUser?.length === 0 ? (
        <Empty className="flex justify-center items-center">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderArchive />
            </EmptyMedia>
            <EmptyTitle> No transactions Found </EmptyTitle>
            <EmptyDescription>Start tracking your money today</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button onClick={() => setIsOpen(true)}>Add Transactions</Button>
            </div>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg shadow-md">
          <table className="min-w-full border border-gray-200 rounded-lg shadow-md ">
            <thead className="bg-gray-100 text-gray-700 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold">
                  email
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold">
                  role
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUser?.map((item: Usr) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-4 py-2 ">{item.name}</td>
                  <td className="px-4 py-2 ">{item.email}</td>
                  <td className="py-2 ">{item.role}</td>

                  <td className="px-4 py-2 flex ">
                    <button
                      className="p-1  text-sm  rounded cursor-pointer "
                      onClick={() => handleEdit(item)}
                    >
                      <SquarePen className="w-4 h-4 text-blue-500" />
                    </button>
                    <button
                      className="p-1 text-sm rounded cursor-pointer"
                      onClick={() => handleDelete(item)}
                    >
                      <Trash className="w-4 h-4 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* className="sm:max-w-106.25" */}
      <div >
        {/* Dialog */}
        <Dialog open={isOpen || !!isEdit} onOpenChange={HandleOpen}>
          <DialogContent className=" sm:max-w-md  md:max-w-lg lg:max-w-xl  max-h-[90vh]  overflow-y-auto rounded-xl" >
            <DialogHeader>
              <DialogTitle>
                {isEdit ? "Editing Student " : "Adding New Student"}
              </DialogTitle>
              <DialogDescription>
                {isEdit ? "Make changes to your " : "Adding "}
                Students here. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 mb-4">
                <div className="grid gap-3">
                  <Label htmlFor="title">fristName *</Label>
                  <Input
                    className="w-full rounded-md border border-input bg-background px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground"
                    id="title"
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    placeholder="@peduarte"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="title">LastName *</Label>
                  <Input
                    className="w-full rounded-md border border-input bg-background px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground"
                    id="title"
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    placeholder="@peduarte"
                  />
                </div>
               {/* gender */}
                <div className="grid gap-3">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    onValueChange={handleSelect("gender")}
                    value={formData.gender}
                  >
                    <SelectTrigger  className="w-full rounded-md border border-input bg-background px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">male</SelectItem>
                      <SelectItem value="female">female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="amount">Age *</Label>
                  <Input
                   className="w-full rounded-md border border-input bg-background px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground"
                    type="number"
                    id="amount"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min={1}
                  />
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="grade">Grade</Label>
                  <Input
                   className="w-full rounded-md border border-input bg-background px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground"
                    type="number"
                    id="grade"
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    min={1}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="sec">section (optional)</Label>
                  <Input
                    className="w-full rounded-md border border-input bg-background px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground"
                    type="text"
                    id="sect"
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="parent">parentName *</Label>
                  <Input
                    className="w-full rounded-md border border-input bg-background px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground"
                    type="text"
                    id="parent"
                    name="parentname"
                    value={formData.parentname}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                   className="w-full rounded-md border border-input bg-background px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground"
                    type="number"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="relation">relationship</Label>
                  <Input
                   className="w-full rounded-md border border-input bg-background px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground"
                    type="text"
                    id="relation"
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <DialogFooter >
                <DialogClose asChild>
                  <Button variant="outline" className=" p-3 rounded-md">Cancel</Button>
                </DialogClose>
                <Button type="submit" className="p-3 rounded-md">
                  {createMutation.isPending ? (
                    <span className="flex justify-center items-center gap-2">
                      <Loader className="animate-spin" />
                      Save changes
                    </span>
                  ) : (
                    "Save changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default VpStudents;
