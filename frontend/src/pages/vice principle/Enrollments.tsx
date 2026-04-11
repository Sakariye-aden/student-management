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
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { FolderArchive, Loader, Pencil, SquarePen, Trash } from "lucide-react";

import api from "../../lib/api/apiStore";
import toast from "react-hot-toast";
import { extractErrorMessages } from "../../utility/errorUtility";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import type { Usr } from "./Students";

interface formInfo {
  teacherId?: string;
  subjectId?: string;
  studentId?: string;
  grade: number;
  section: string;
  year: number;
}

interface StdItem extends formInfo {
  _id: string;
}

type sbj = {
  _id: string;
  name: string;
};
type tchr = {
  _id: string;
  firstname: string;
};

interface tchEnr {
  _id: string;
  teacherId?: tchr;
  subjectId?: sbj;
  studentId?: tchr;
  grade: number;
  section: string;
  year: number;
}

const Enrollments = () => {
  const queryClient = useQueryClient();

  const [isEdit, setisEdit] = useState<Usr | null>(null);
  const [isDelete, setIsDelete] = useState<Usr | null>(null);

  // teacher information states
  const [editTeacher, setEditTeacher] = useState<tchEnr | null>(null);
  const [deleteTeacher, setdeleteTeacher] = useState<tchEnr | null>(null);
  // student 
   const [editStudent, setEditStudent ] = useState<tchEnr | null>(null);
  const [deleteStudent, setdeleteStudent] = useState<tchEnr | null>(null);


  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  // student form
  const [isStudent, setStudent] = useState(false);

  const [formData, setFormData] = useState<formInfo>({
    grade: 0,
    section: "",
    year: 0,
  });

  // const queryClient = useQueryClient()

  const HandleOpen = () => {
    setIsOpen(false);
    setisEdit(null);
    setIsDelete(null);
    setEditTeacher(null);
    setdeleteTeacher(null);
    setIsDeleteOpen(false);
    setStudent(false);
   
    setEditStudent(null)
    setdeleteStudent(null)

    // clear form
    setFormData({
      teacherId: "",
      subjectId: "",
      grade: 0,
      section: "",
      year: 0,
    });
  };

  const handleStudent = () => {
    setIsOpen(true);
    setStudent(true);
  };

  // handle Edit Teacher
  const handleEditTeacher = (item: tchEnr) => {
    setEditTeacher(item);
    console.log("Edit Teacher Enroll item", item);
    setFormData({
      // teacherId:item.teacherId?.firstname,
      // subjectId:item.subjectId?.name,
      grade: item.grade,
      section: item.section,
      year: item.year,
    });
  };
  // handle Delete teacher
  const handleDeleteTeacher = (item: tchEnr) => {
    setdeleteTeacher(item);
    console.log("detete teacher enroll", item);
  };

  // handle Edit Student
  const handleEditStudent = (item: tchEnr) => {
    setEditStudent(item);
    setStudent(true)
    setFormData({
      grade: item.grade,
      section: item.section,
      year: item.year,
    });
  };
  // handle Delete Student
  const handleDeleteStudent = (item: tchEnr) => {
    setdeleteStudent(item);
  };



  // handle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  // handle select
  const handleSelect = (field: keyof formInfo) => (value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  //  get Enroolment students in the studentenrollment collection
  const { data: teacherEnroll, isLoading: LoadTchrEnroll } = useQuery({
    queryKey: ["teacherenrollments"],
    queryFn: async () => {
      const response = await api.get("/teacherenrollment");
      // console.log("techr enrl", response.data);
      return response.data;
    },
  });
  //  get Enroolment students in the studentenrollment collection
  const { data: studentEnroll, isLoading: LoadStdEnroll } = useQuery({
    queryKey: ["studentenrollments"],
    queryFn: async () => {
      const response = await api.get("/studentenrollment");
      // console.log('student enrollment :',response.data);
      return response.data;
    },
  });

  //  get All subjects
  const { data: subjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const response = await api.get("/subject");
      return response.data;
    },
  });

  //  get All teachers
  const { data: teachers } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const response = await api.get("/teacher");
      return response.data;
    },
  });

  //  get All students
  const { data: students } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const response = await api.get("/student");
      return response.data;
    },
  });

  // create mutataion for teacher enrollment;
  const createTeacherMutation = useMutation({
    mutationFn: async (userData: formInfo) => {
      const response = await api.post("/teacherenrollment", userData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacherenrollments"] });
      toast.success("teacher assigned successfully.");
      setIsOpen(false);
      setisEdit(null);
    },
    onError: (error) => {
      console.log("create user error", error);
      toast.error(extractErrorMessages(error));
    },
  });

  // update Mutation for teacher enrollment
  const updateTeacherMutation = useMutation({
    mutationFn: async (updateData: formInfo) => {
      const response = await api.put(
        `/teacherenrollment/${editTeacher?._id}`,
        updateData,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("updated teacher enrollment information successfully");
      queryClient.invalidateQueries({ queryKey: ["teacherenrollments"] });
      setEditTeacher(null);
    },
    onError: (error) => {
      console.log("error updated tchrEnr", error);
      toast.error(extractErrorMessages(error));
    },
  });

  // Delete Mutation for teacher enrollment

  // create Mutation for student  enrollment
   const createStudentMutation = useMutation({
    mutationFn: async (userData: formInfo) => {
      const response = await api.post("/studentenrollment", userData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentenrollments"] });
      toast.success("student enrolled successfully.");
      setIsOpen(false);
      setisEdit(null);
    },
    onError: (error) => {
      toast.error(extractErrorMessages(error));
      console.log('std enroll',error);
    },
  });



  // update Mutation for student enrollment
     const updateStudentMutation = useMutation({
    mutationFn: async (updateData: formInfo) => {
      const response = await api.put(
        `/studentenrollment/${editStudent?._id}`,
        updateData,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("updated student enrollment information successfully");
      queryClient.invalidateQueries({ queryKey: ["studentenrollments"] });
      setEditStudent(null);
    },
    onError: (error) => {
      console.log("error updated std Enr", error);
      toast.error(extractErrorMessages(error));
    },
  });


  // delete Mutation for student  enrollment







  // handleSubmit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.subjectId ||!formData.grade ||!formData.year  ) {
      toast.error("all fields are required * ");
      return;
    }

    //  register and update Teacher enroolmernt 
    if (editTeacher) {
       //  updated teachers enroll
      updateTeacherMutation.mutate({
        teacherId: formData.teacherId,
        subjectId: formData.subjectId,
        grade: Number(formData.grade),
        section: formData.section,
        year: Number(formData.year),
      });
    } else if (formData.teacherId){
      // register teacher enroll   
      createTeacherMutation.mutate({
        teacherId: formData.teacherId,
        subjectId: formData.subjectId,
        grade: Number(formData.grade),
        section: formData.section,
        year: Number(formData.year),
      });
    }


    // update and register student 
    if(editStudent){
      //  update student enroll 
        updateStudentMutation.mutate({
        studentId: formData.studentId,
        subjectId: formData.subjectId,
        grade: Number(formData.grade),
        section: formData.section,
        year: Number(formData.year),
      });
    }else if (formData.studentId){
      //  register Student enroll 
      createStudentMutation.mutate({
        studentId: formData.studentId,
        subjectId: formData.subjectId,
        grade: Number(formData.grade),
        section: formData.section,
        year: Number(formData.year),
      });
    }
    
 console.log("formdata is enroll", formData);
    // clear form
    setFormData({
      teacherId: "",
      studentId :"",
      subjectId: "",
      grade: 0,
      section: "",
      year: 0,
    });
   

    setIsOpen(false);
  };

  if (LoadStdEnroll || LoadTchrEnroll) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader className="animate-spin text-3xl" />
      </div>
    );
  }

  return (
    <div className="bg-card min-h-screen p-6 ">
      <h1 className="text-2xl font-medium py-2 text-blue-600">
        Enrollment management.
      </h1>
      <div className="flex flex-col my-2">
        <p className=" text-blue-600">
          The Enrollment and assignment section enables the adminstration to
          assign subjects for both teachers and students efficiently
        </p>
        <div className="flex justify-between my-2">
          <h2 className="font-bold text-xl text-violet-600">
            enroll teacher to subjects
          </h2>
          <Button
            className="cursor-pointer p-2 rounded-md"
            onClick={() => setIsOpen(true)}
          >
            Enroll teachers
          </Button>
        </div>
      </div>
      {/* techer enroollment  */}
      <div>
        {teacherEnroll?.length == 0 ? (
          <Empty className="flex justify-center items-center">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderArchive />
              </EmptyMedia>
              <EmptyTitle> No Teacher Found </EmptyTitle>
              <EmptyDescription>
                we don't assign teacher to subjects yet..{" "}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="flex gap-2">
                <Button className="rounded-md">assign teacher</Button>
              </div>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg shadow-md">
            <table className="min-w-full border border-gray-200 rounded-lg shadow-md ">
              <thead className="bg-gray-100 text-blue-600 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    subject
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    Grade
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {teacherEnroll?.map((item: tchEnr) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 transition-colors duration-200 text-blue-600"
                  >
                    <td className="px-4 py-2 ">{item.teacherId?.firstname}</td>
                    <td className="px-4 py-2 ">{item.subjectId?.name}</td>
                    <td className="py-2 ">{item.grade}</td>

                    <td className="px-4 py-2 flex ">
                      <button
                        className="p-1  text-sm  rounded cursor-pointer "
                        onClick={() => handleEditTeacher(item)}
                      >
                        <Pencil className="w-4 h-4 text-blue-500" />
                      </button>
                      <button
                        className="p-1 text-sm rounded cursor-pointer"
                        onClick={() => handleDeleteTeacher(item)}
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
      </div>

      {/*student  */}
      <div>
        <div className="flex justify-between my-2">
          <h2 className="font-bold text-xl text-violet-600">
            enroll student to subjects
          </h2>
          <Button
            className="cursor-pointer p-2 rounded-md"
            onClick={() => handleStudent()}
          >
            Enroll Students
          </Button>
        </div>
        <div>
          {studentEnroll?.length == 0 ? (
            <Empty className="flex justify-center items-center">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FolderArchive />
                </EmptyMedia>
                <EmptyTitle> No Student Found </EmptyTitle>
                <EmptyDescription>
                  we don't enroll students to subjects yet..{" "}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <div className="flex gap-2">
                  <Button className="rounded-md">assign teacher</Button>
                </div>
              </EmptyContent>
            </Empty>
          ) : (
            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg shadow-md">
              <table className="min-w-full border border-gray-200 rounded-lg shadow-md ">
                <thead className="bg-gray-100 text-blue-600 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">
                      subject
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">
                      Grade
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {studentEnroll?.map((item: tchEnr) => (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-50 transition-colors duration-200 text-blue-600"
                    >
                      <td className="px-4 py-2 ">
                        {item.studentId?.firstname}
                      </td>
                      <td className="px-4 py-2 ">{item.subjectId?.name}</td>
                      <td className="py-2 ">{item.grade}</td>

                      <td className="px-4 py-2 flex ">
                        <button
                          className="p-1  text-sm  rounded cursor-pointer "
                          onClick={() => handleEditStudent(item)}
                        >
                          <Pencil className="w-4 h-4 text-blue-500" />
                        </button>
                        <button
                          className="p-1 text-sm rounded cursor-pointer"
                          onClick={() => handleDeleteStudent(item)}
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
        </div>
      </div>

      <div>
        {/* Dialog */}
        <Dialog
          open={isOpen || !!isEdit || !!editTeacher ||!!editStudent}
          onOpenChange={HandleOpen}
        >
          <DialogContent className=" sm:max-w-md  md:max-w-lg lg:max-w-xl  max-h-[90vh]  overflow-y-auto rounded-xl">
            <DialogHeader>
              <DialogTitle>
                {isStudent
                  ? "Enrolling student to subject "
                  : "Assigning teacher to subject"}
              </DialogTitle>
              <DialogDescription>
                {isEdit ? "Make changes to your " : "Adding "}
                Subjects here. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 mb-4">
                {/* gender */}
                <div className="grid gap-3">
                  {isStudent ? (
                    <div>
                      <Label htmlFor="student">student *</Label>
                      <Select
                        onValueChange={handleSelect("studentId")}
                        value={formData.studentId}
                        required
                      >
                        <SelectTrigger className="w-full rounded-md border border-input bg-background px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground">
                          <SelectValue placeholder="Select student" />
                        </SelectTrigger>
                        <SelectContent>
                          {students?.map((item: tchr) => (
                            <SelectItem value={item._id} key={item._id}>
                              {item.firstname}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="teachers">teachers *</Label>
                      <Select
                        onValueChange={handleSelect("teacherId")}
                        value={formData.teacherId}
                        required
                      >
                        <SelectTrigger className="w-full rounded-md border border-input bg-background px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground">
                          <SelectValue placeholder="Select teacher" />
                        </SelectTrigger>
                        <SelectContent>
                          {teachers?.map((item: tchr) => (
                            <SelectItem value={item._id} key={item._id}>
                              {item.firstname}
                            </SelectItem>
                          ))}

                          {/* <SelectItem value="female">female</SelectItem> */}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="subject">subjects *</Label>
                  <Select
                    onValueChange={handleSelect("subjectId")}
                    value={formData.subjectId}
                    required
                  >
                    <SelectTrigger className="w-full rounded-md border border-input bg-background px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects?.map((item: sbj) => (
                        <SelectItem value={item._id} key={item._id}>
                          {item.name}
                        </SelectItem>
                      ))}

                      {/* <SelectItem value="female">female</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="grade">Grade *</Label>
                  <Input
                    className="w-full rounded-md border border-input bg-background px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground"
                    type="number"
                    id="grade"
                    name="grade"
                    placeholder="10"
                    value={formData.grade}
                    onChange={handleChange}
                    min={1}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="section">section *</Label>
                  <Input
                    className="w-full rounded-md border border-input bg-background px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground"
                    type="text"
                    id="section"
                    name="section"
                    placeholder="A"
                    value={formData.section}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="year">year *</Label>
                  <Input
                    className="w-full rounded-md border border-input bg-background px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground"
                    type="number"
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="2025"
                    min={1}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className=" p-3 rounded-md">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" className="p-3 rounded-md">
                  {isEdit ? (
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

export default Enrollments;
