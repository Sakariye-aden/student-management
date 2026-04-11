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
  userId?: string;
  firstname: string;
  lastname: string;
  gender: string;
  phone: number;
  qualification : string;
}

interface StdItem extends formInfo {
  _id: string;
}

const VpTeacher = () => {
  const queryClient = useQueryClient();

  const [isEdit, setisEdit] = useState<Usr | null>(null);
  const [isDelete, setIsDelete] = useState<Usr | null>(null);
  // student information states
  const [editTeacher, setEditTeacher] = useState<StdItem | null>(null);
  const [deleteTeacher, setdeleteTeacher] = useState<StdItem | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [formData, setFormData] = useState<formInfo>({
    firstname: "",
    lastname: "",
    gender: "",
    phone: 1,
    qualification: "",
  });

  // const queryClient = useQueryClient()

  const HandleOpen = () => {
    setIsOpen(false);
    setisEdit(null);
    setIsDelete(null);
    setEditTeacher(null);
    setdeleteTeacher(null);
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

  //  edit teacher Informatio
  const handleEditTeacher = (item: StdItem) => {
    setEditTeacher(item);
    setFormData({
      firstname: item.firstname,
      lastname: item.lastname,
      gender: item.gender,
      phone: item.phone,
      qualification: item.qualification,
    });
  };

  //  delete teacher information
  const handleDeleteTeacher = (item: StdItem) => {
    setdeleteTeacher(item);
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

  //delete all teacher info 
  const DeleteConfirmation = async () => {
    try {
      if (isDelete) {
        await DeleteUserMutation.mutateAsync(isDelete?._id);
        setIsOpen(false);
        setIsDelete(null);
      } else {
        await DeleteStudentMutation.mutateAsync(deleteTeacher?._id!);
        setIsOpen(false);
        setdeleteTeacher(null);
      }
    } catch (error) {
      toast.error("error happened during Deletion");
      setIsOpen(false);
    }
  };

  // register teacher
  const createMutation = useMutation({
    mutationFn: async (userData: formInfo) => {
      const response = await api.post("/teacher", userData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("teacher registered successfully.");
      setIsOpen(false);
      setisEdit(null)
    },
    onError: (error) => {
      console.log("create user error", error);
      toast.error(extractErrorMessages(error));
    },
  });

  // delete User whose role is Teacher
  const DeleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/Auth/user/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("teacher deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsDeleteOpen(false);
      setIsDelete(null);
    },
    onError: (error) => {
      toast.error(extractErrorMessages(error));
    },
  });

  //  edit teacher info
  // put mutation teacher
  const UpdateMutation = useMutation({
    mutationFn: async (updateData: formInfo) => {
      const response = await api.put(
        `/teacher/${editTeacher?._id}`,
        updateData,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("updated teacher information successfully");
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      setEditTeacher(null);
    },
    onError: (error) => {
      toast.error(extractErrorMessages(error));
    },
  });

  // delete mutation teachers

  const DeleteStudentMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/teacher/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("teacher deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      setIsDeleteOpen(false);
      setIsDelete(null);
    },
    onError: (error) => {
      toast.error(extractErrorMessages(error));
    },
  });

  // get user whose role is student  and then register
  const { data: teacherRole } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get("/Auth/all");
      return response.data;
    },
  });

  //  get students in the student collection
  const { data: Teachers, isLoading:LoadTeacher } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const response = await api.get("/teacher");
      return response.data;
    },
  });

  const filteredUser = teacherRole?.filter((u: Usr) => u.role == "teacher");
  
  // handleSubmit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.firstname ||
      !formData.lastname ||
      !formData.gender ||
      !formData.phone ||
      !formData.qualification
    ) {
      console.log("errors happaned.");
      toast.error("all fields are required * ");
      return;
    }

    if (editTeacher) {
      //  updated Students
      UpdateMutation.mutate({
        userId: editTeacher?.userId,
        firstname: formData.firstname.trim(),
        lastname: formData.lastname.trim(),
        gender: formData.gender,
        phone: Number(formData.phone),
        qualification: formData.qualification.trim(),
      });
    } else {
      // register User
      createMutation.mutate({
        userId: isEdit?._id,
        firstname: formData.firstname.trim(),
        lastname: formData.lastname.trim(),
        gender: formData.gender,
        phone: Number(formData.phone),
        qualification: formData.qualification.trim(),
      });
    }

    // clear form
    setFormData({
      firstname: "",
      lastname: "",
      gender: "",
      phone: 1,
      qualification: "",
    });

    setIsOpen(false);
  };


  if(LoadTeacher){
     return (
          <div className='h-screen flex justify-center items-center'>
             <Loader className='animate-spin text-3xl' />
          </div>
       )
  }





  return (
    <div className="bg-card min-h-screen p-6 ">
      <h1 className="text-2xl font-medium py-2 text-blue-600">Teacher management.</h1>
      <div className="flex justify-between items-center my-2">
        <p className="font-medium text-blue-600">
          Teacher management is designed to handle all teacher-related information with in the institution  
        </p>
        <Button
          className="cursor-pointer p-2 rounded-md"
          onClick={() => setIsOpen(true)}
        >
          Register Teacher
        </Button>
      </div>
       <h1 className="text-lg text-blue-600 py-4">Teacher Login confirmed — additional details required *</h1>
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
                  className="hover:bg-gray-50 transition-colors duration-200 text-blue-600"
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
        <h2 className="text-blue-600 text-lg py-3">Teachers who finish registration will appear in this list.</h2>
        {Teachers?.length == 0 ? (
          <Empty className="flex justify-center items-center">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderArchive />
              </EmptyMedia>
              <EmptyTitle> No Teacher yet  </EmptyTitle>
              <EmptyDescription>there is no Teacher here </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="flex gap-2">
                <Button className="rounded-md">
                  Register Teacher
                </Button>
              </div>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg shadow-md">
            <table className="min-w-full border border-gray-200 rounded-lg shadow-md ">
              <thead className="bg-gray-100 text-gray-700 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    F.Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    L.Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    Qualifaction
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Teachers?.map((item: StdItem) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-4 py-2 ">{item.firstname}</td>
                    <td className="px-4 py-2 ">{item.lastname}</td>
                    <td className="py-2 ">{item.qualification}</td>

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

      <div>
        {/* Dialog */}
        <Dialog
          open={isOpen || !!isEdit || !!editTeacher}
          onOpenChange={HandleOpen}
        >
          <DialogContent className=" sm:max-w-md  md:max-w-lg lg:max-w-xl  max-h-[90vh]  overflow-y-auto rounded-xl">
            <DialogHeader>
              <DialogTitle>
                {editTeacher ? "Editing Teacher " : "Adding New Teacher"}
              </DialogTitle>
              <DialogDescription>
                {isEdit ? "Make changes to your " : "Adding "}
                Teachers here. Click save when you&apos;re done.
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
                  <Label htmlFor="phone">Phone *</Label>
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
                  <Label htmlFor="qualification">Qualification *</Label>
                  <Input
                    className="w-full rounded-md border border-input bg-background px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground"
                    type="text"
                    id="qualification"
                    name="qualification"
                    value={formData.qualification}
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
        open={isDeleteOpen || !!isDelete || !!deleteTeacher}
        onOpenChange={HandleOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you absolutely sure to delete ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              <span className="text-lg font-medium pr-1">
                {isDelete ? isDelete.name : deleteTeacher?.firstname}
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

export default VpTeacher;
