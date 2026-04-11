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

interface StdItem extends formInfo {
  _id: string;
}

const VpStudents = () => {
  const queryClient = useQueryClient();

  const [isEdit, setisEdit] = useState<Usr | null>(null);
  const [isDelete, setIsDelete] = useState<Usr | null>(null);
  // student information states
  const [editStudent, setEditStudent] = useState<StdItem | null>(null);
  const [deleteStudent, setdeleteStudent] = useState<StdItem | null>(null);

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
    setEditStudent(null);
    setdeleteStudent(null);
    setIsDeleteOpen(false);
  };

  // handle Edit
  const handleEdit = (item: Usr) => {
    setisEdit(item);
  };

  // handle Delete
  const handleDelete = (item: Usr) => {
    setIsDelete(item);
  };

  //  edit student Informatio
  const EditStudent = (item: StdItem) => {
    setEditStudent(item);
    setFormData({
      firstname: item.firstname,
      lastname: item.lastname,
      gender: item.gender,
      age: item.age,
      grade: item.grade,
      section: item.section,
      parentname: item.parentname,
      phone: item.phone,
      relationship: item.relationship,
    });
  };

  //  delete student information
  const DeleteStudent = (item: StdItem) => {
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

  const DeleteConfirmation = async () => {
    try {
      if (isDelete) {
        await DeleteUserMutation.mutateAsync(isDelete?._id);
        setIsOpen(false);
        setIsDelete(null);
      } else {
        await DeleteStudentMutation.mutateAsync(deleteStudent?._id!);
        setIsOpen(false);
        setdeleteStudent(null);
      }
    } catch (error) {
      toast.error("error happened during Deletion");
      setIsOpen(false);
    }
  };

  // register student
  const createMutation = useMutation({
    mutationFn: async (userData: formInfo) => {
      const response = await api.post("/student", userData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("student registered successfully.");
      setIsOpen(false);
      setisEdit(null)
    },
    onError: (error) => {
      console.log("create user error", error);
      toast.error(extractErrorMessages(error));
    },
  });

  // delete User whose role is Student
  const DeleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/Auth/user/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("student deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsDeleteOpen(false);
      setIsDelete(null);
    },
    onError: (error) => {
      toast.error(extractErrorMessages(error));
    },
  });

  //  edit Students info
  // put mutation students
  const UpdateMutation = useMutation({
    mutationFn: async (updateData: formInfo) => {
      const response = await api.put(
        `/student/${editStudent?._id}`,
        updateData,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("updated student information successfully");
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setEditStudent(null);
    },
    onError: (error) => {
      toast.error(extractErrorMessages(error));
    },
  });

  // delete mutation Student

  const DeleteStudentMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/student/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("student deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setIsDeleteOpen(false);
      setIsDelete(null);
    },
    onError: (error) => {
      toast.error(extractErrorMessages(error));
    },
  });

  // get user whose role is student  and then register
  const { data: StudentRole } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get("/Auth/all");
      return response.data;
    },
  });

  //  get students in the student collection
  const { data: Students } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const response = await api.get("/student");
      return response.data;
    },
  });

  const filteredUser = StudentRole?.filter((u: Usr) => u.role == "student");

  // handleSubmit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.firstname ||
      !formData.lastname ||
      !formData.gender ||
      !formData.age ||
      !formData.gender ||
      !formData.parentname ||
      !formData.phone ||
      !formData.relationship
    ) {
      console.log("errors happaned.");
      toast.error("all fields are required * ");
      return;
    }

    if (editStudent) {
      //  updated Students
      UpdateMutation.mutate({
        userId: editStudent?.userId,
        firstname: formData.firstname.trim(),
        lastname: formData.lastname.trim(),
        gender: formData.gender,
        age: Number(formData.age),
        grade: Number(formData.grade),
        section: formData.section.trim(),
        parentname: formData.parentname.trim(),
        phone: Number(formData.phone),
        relationship: formData.relationship.trim(),
      });
    } else {
      // register User
      createMutation.mutate({
        userId: isEdit?._id,
        firstname: formData.firstname.trim(),
        lastname: formData.lastname.trim(),
        gender: formData.gender,
        age: Number(formData.age),
        grade: Number(formData.grade),
        section: formData.section.trim(),
        parentname: formData.parentname.trim(),
        phone: Number(formData.phone),
        relationship: formData.relationship.trim(),
      });
    }

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
    });

    setIsOpen(false);
  };

  return (
    <div className="bg-card min-h-screen p-6 ">
      <h1 className="text-2xl font-medium py-2 text-blue-600">Student management.</h1>
      <div className="flex justify-between items-center my-2">
        <p className=" text-blue-600">
          The Student management allows the vice principle to efficiently register ,update,and manage student records withh in the school
        </p>
        <Button
          className="cursor-pointer p-2 rounded-md"
          onClick={() => setIsOpen(true)}
        >
          Register student
        </Button>
      </div>
       <h1 className="text-lg text-blue-600 py-4">student Login confirmed — additional details required *</h1>
      {filteredUser?.length === 0 ? (
        <Empty className="flex justify-center items-center">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderArchive />
            </EmptyMedia>
            <EmptyTitle> No student Found </EmptyTitle>
            <EmptyDescription>there is no student here </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button onClick={() => setIsOpen(true)}>Register student</Button>
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
                  className="hover:bg-gray-50 transition-colors duration-200 text-blue-500"
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
      {/* students  */}
      <div className="my-3">
        <h2 className="text-blue-600 text-lg py-3">Students who finish registration will appear in this list.</h2>
        {Students?.length == 0 ? (
          <Empty className="flex justify-center items-center">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderArchive />
              </EmptyMedia>
              <EmptyTitle> No user Found that whose role is student </EmptyTitle>
              <EmptyDescription>there is no student here </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="flex gap-2">
                <Button className="rounded-md">
                  Register student
                </Button>
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
                    Grade
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    Age
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Students?.map((item: StdItem) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 transition-colors duration-200 text-blue-600"
                  >
                    <td className="px-4 py-2 ">{item.firstname}</td>
                    <td className="px-4 py-2 ">{item.grade}</td>
                    <td className="py-2 ">{item.age}</td>

                    <td className="px-4 py-2 flex ">
                      <button
                        className="p-1  text-sm  rounded cursor-pointer "
                        onClick={() => EditStudent(item)}
                      >
                        <Pencil className="w-4 h-4 text-blue-500" />
                      </button>
                      <button
                        className="p-1 text-sm rounded cursor-pointer"
                        onClick={() => DeleteStudent(item)}
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

      <div>
        {/* Dialog */}
        <Dialog
          open={isOpen || !!isEdit || !!editStudent}
          onOpenChange={HandleOpen}
        >
          <DialogContent className=" sm:max-w-md  md:max-w-lg lg:max-w-xl  max-h-[90vh]  overflow-y-auto rounded-xl">
            <DialogHeader>
              <DialogTitle>
                {editStudent ? "Editing Student " : "Adding New Student"}
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
                    <SelectTrigger className="w-full rounded-md border border-input bg-background px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground">
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
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className=" p-3 rounded-md">
                    Cancel
                  </Button>
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
      {/* alert Dialog  */}
      <AlertDialog
        open={isDeleteOpen || !!isDelete || !!deleteStudent}
        onOpenChange={HandleOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you absolutely sure to delete ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              <span className="text-lg font-medium pr-1">
                {isDelete ? isDelete.name : deleteStudent?.firstname}
              </span>
              cannot be undone. This will permanently delete your account and
              remove your data from our servers
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button onClick={DeleteConfirmation}>
              {DeleteStudentMutation.isPending ? (
                <span className="flex justify-center items-center gap-2">
                  <Loader className="animate-spin" />
                  Delete
                </span>
              ) : (
                "Delete"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VpStudents;
