import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "../../components/ui/button";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../../components/ui/empty";

import { FolderArchive, Loader, Pencil, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

import toast from "react-hot-toast";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import api from "../../lib/api/apiStore";
import { extractErrorMessages } from "../../utility/errorUtility";


interface ISubj {
  _id? : string
 name : string
}

interface formInfo {
  name : string
}

const VpSubjects = () => {
  const queryClient = useQueryClient();

  const [isEdit, setisEdit] = useState<ISubj | null>(null);
  const [isDelete, setIsDelete] = useState<ISubj | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [formData, setFormData] = useState<formInfo>({
    name: ""
  });

  // const queryClient = useQueryClient()

  const HandleOpen = () => {
    setIsOpen(false);
    setisEdit(null);
    setIsDelete(null);
    setIsDeleteOpen(false);
  };

  // handle Edit
  const handleEdit = (item:ISubj) => {
    setisEdit(item);
    setFormData({
      name : item.name
    })
     
  };

  // handle Delete
  const handleDelete = (item: ISubj) => {
    setIsDelete(item);
  };

  
  
  // handle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  //delete subject 
  const DeleteConfirmation = async () => {
    try {
     
        await DeleteMutation.mutateAsync(isDelete?._id!);
        setIsOpen(false);
        setIsDelete(null);
      
    } catch (error) {
      toast.error("error happened during Deletion");
      setIsOpen(false);
    }
  };

  // register subject 
  const createMutation = useMutation({
    mutationFn: async (userData: formInfo) => {
      const response = await api.post("/subject", userData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      toast.success("subject registered successfully.");
      setIsOpen(false);
      setisEdit(null)
    },
    onError: (error) => {
      console.log("create user error", error);
      toast.error(extractErrorMessages(error));
    },
  });

  
  //  edit subject info
  // put mutation subject
  const UpdateMutation = useMutation({
    mutationFn: async (updateData: formInfo) => {
      const response = await api.put(
        `/subject/${isEdit?._id}`,
        updateData,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("updated subject successfully");
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      setisEdit(null);

    },
    onError: (error) => {
      toast.error(extractErrorMessages(error));
    },
  });

  // delete mutation subject
  const DeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/subject/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("subject deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      setIsDeleteOpen(false);
      setIsDelete(null);
    },
    onError: (error) => {
      toast.error(extractErrorMessages(error));
    },
  });

  

  //  get students in the student collection
  const { data: subject, isLoading:LoadSubject } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const response = await api.get("/subject");
      return response.data;
    },
  });

  
  // handleSubmit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if ( !formData.name) {
      console.log("errors happaned.");
      toast.error("all fields are required * ");
      return;
    }

    if (isEdit) {
      //  updated Students
      UpdateMutation.mutate({
        name: formData.name.trim()
      });
    } else {
      // register User
      createMutation.mutate({
        name: formData.name.trim(),
      });
    }
    // clear form
    setFormData({ name: "",});

    setIsOpen(false);
  };


  if(LoadSubject){
     return (
          <div className='h-screen flex justify-center items-center'>
             <Loader className='animate-spin text-3xl' />
          </div>
       )
  }





  return (
    <div className="bg-card min-h-screen p-6 ">
      <h1 className="text-2xl font-medium py-2 text-blue-600">Subject management.</h1>
      <div className="flex justify-between items-center my-2">
        <p className="text-blue-600">
         Allow vice principle to define and organize all subjects offered in the school. each subject can be created updated or removed as needed
        </p>
        <Button
          className="cursor-pointer p-2 rounded-md"
          onClick={() => setIsOpen(true)}
        >
          Add Subject
        </Button>
      </div>
       <h1 className="text-lg text-blue-600 py-4">Subjects confirmed — update delete *</h1>
      {subject?.length === 0 ? (
        <Empty className="flex justify-center items-center">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderArchive />
            </EmptyMedia>
            <EmptyTitle> No subject Found </EmptyTitle>
            <EmptyDescription>there is no subject here </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button onClick={() => setIsOpen(true)}>Add Subject</Button>
            </div>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg shadow-md">
          <table className="min-w-full border border-gray-200 rounded-lg shadow-md ">
            <thead className="bg-gray-100 text-blue-500 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">
                 subject name
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subject?.map((item:ISubj) => (
                <tr
                  key={item._id}
                  className="hover:bg-blue-100 transition-colors duration-200 text-blue-600"
                >
                  <td className="px-4 py-2 ">{item.name}</td>
                  <td className="px-4 py-2 flex ">
                    <button
                      className="p-1  text-sm  rounded cursor-pointer "
                      onClick={() => handleEdit(item)}
                    >
                      <Pencil className="w-4 h-4 text-blue-500" />
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
      

      <div>
        {/* Dialog */}
        <Dialog
          open={isOpen || !!isEdit}
          onOpenChange={HandleOpen}
        >
          <DialogContent className=" sm:max-w-md  md:max-w-lg lg:max-w-xl  max-h-[90vh]  overflow-y-auto rounded-xl">
            <DialogHeader>
              <DialogTitle>
                {isEdit ? "Editing Subject " : "Adding New subject"}
              </DialogTitle>
              <DialogDescription>
                {isEdit ? "Make changes to your " : "Adding "}
                subjects here. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 mb-4">
                <div className="grid gap-3">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    className="w-full rounded-md border border-input bg-background px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground"
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="@peduarte"
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
        open={isDeleteOpen || !!isDelete}
        onOpenChange={HandleOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you absolutely sure to delete ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              <span className="text-xl  font-medium pr-1">
                {isDelete?.name}
              </span>
              cannot be undone. This will permanently delete your account and
              remove your data from our servers
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button onClick={DeleteConfirmation}>
              {DeleteMutation.isPending ? (
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

export default VpSubjects;
