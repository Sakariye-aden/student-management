import { Link, Outlet, useNavigate } from "react-router";

import { useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";
import useAuthStore from "../../lib/store/useStore";

import { useQueryClient } from "@tanstack/react-query";
import { BookOpen, ClipboardPenLine, LayoutDashboard, LogOut, Menu, ShieldUser, Trophy, UserCheck, Users } from "lucide-react";
import { Button } from "../../components/ui/button";




const ViceDashboard = () => {

   
   const { user, clearAuth } = useAuthStore();
   const [isOpen, setisOpen] = useState(true);

    const navigate = useNavigate();
    const queryclient = useQueryClient()  


    const handleLogout = ()=>{
        clearAuth();
        queryclient.clear();
        navigate('/login', {replace : true })
    }






  return (
 



  <div className="min-h-screen">
       {/* labtop designn */}
       <div className="hidden md:flex  min-h-screen">
         {/* left bar */}
         <div className="border-r bg-card ">
           {/* nav */}
           <div className="bg-card border-b  p-2 sticky top-0">
             <span className="font-medium text-2xl text-chart-4 ">📚Focus</span>
             {isOpen && <span className="pl-2 text-xl ">academy</span>}
           </div>

           <div className="h-110 flex flex-col gap-6 px-2 py-6 border-b sticky top-15 text-blue-500">
             <Link to="/vice-principal" className="flex items-center space-x-2">
               <LayoutDashboard className="w-6 h-6" />
               {isOpen && <span>Dashboard</span>}
             </Link>
             <Link
               to="students"
               className="flex items-center space-x-2"
             >
               <Users />
               {isOpen && <span>students</span>}
             </Link>
             <Link
               to="teachers"
               className="flex items-center space-x-2"
             >
               <UserCheck />
               {isOpen && <span>teachers</span>}
             </Link>
             <Link
               to="subjects"
               className="flex items-center space-x-2"
             >
               <BookOpen />
               {isOpen && <span>subjects</span>}
             </Link>
             <Link
               to="enrolls"
               className="flex items-center space-x-2"
             >
               <ClipboardPenLine />
               {isOpen && <span>enrollments</span>}
             </Link>
             <Link
               to="results"
               className="flex items-center space-x-2"
             >
                <Trophy />
               {isOpen && <span>results</span>}
             </Link>
             <Link
               to="roles"
               className="flex items-center space-x-2"
             >
                <ShieldUser />
               {isOpen && <span>roles</span>}
             </Link>
            
           </div>
           <div className="fixed bottom-0 ">
             <div className="flex p-2">
                <div className="h-12 w-12 flex justify-center  rounded-full bg-blue-500">
                   <span className="text-4xl text-white"> {user?.name[0].toUpperCase()}</span>
                </div>
               <div className="flex flex-col pl-2 inset-0 overflow-hidden ">
                 {isOpen && (
                   <span className="font-medium text-lg text-blue-400">{user?.name}</span>
                 )}
                 {isOpen && <span className="text-blue-400">{user?.role}</span>}
               </div>
             </div>
             <div className="p-2 ">
               <Button onClick={handleLogout} className="px-4 rounded-md">
                 <LogOut />
                 {isOpen && 'Logout'}
               </Button>
             </div>
           </div>
         </div>
         {/* right bar  */}
         <div className="flex-1">
           <div className="bg-card flex items-center justify-between p-1 border-b sticky top-0">
             <div className="flex space-x-2">
               <Menu onClick={() => setisOpen(!isOpen)} />
               {/* <h1>Dashboard</h1> */}
             </div>
             <div className="flex items-center space-x-4 mr-5">
               
               <div className="h-10 w-10 flex justify-center  rounded-full bg-blue-500">
                   <span className="text-3xl text-white  "> {user?.name[0].toUpperCase()}</span>
                </div>
             </div>
           </div>
           {/* main component */}
           <div className="bg-card min-h-screen">
             <Outlet />
           </div>
         </div>
       </div>

       {/* mobile  design  */}
       <div className="md:hidden">
         <div className="bg-card py-2 px-4 border-b  flex  items-center justify-between sticky top-0">
           <Sheet>
             <SheetTrigger asChild>
               <Menu />
             </SheetTrigger>
             <SheetContent>
               <SheetHeader>
                 <SheetTitle>
                   <div className="bg-card border-b  p-2">
                     <span className="font-medium text-2xl text-chart-1">
                       📚Focus 
                     </span>
                     <span className="pl-2 text-xl">Academy</span>
                   </div>
                 </SheetTitle>

                 <div className="h-100 flex  flex-col gap-6 px-2 py-6 border-b text-lg text-blue-500">
                   <Link to="/vice-principal">
                     <SheetClose className="flex items-center space-x-2 cursor-pointer">
                       <LayoutDashboard className="w-6 h-6" />
                       <span>Dashboard</span>
                     </SheetClose>
                   </Link>
                   <Link to="students">
                     <SheetClose className="flex items-center space-x-2 cursor-pointer">
                       <Users/>
                       <span>students</span>
                     </SheetClose>
                   </Link>
                   <Link to="teachers">
                     <SheetClose className="flex items-center space-x-2 cursor-pointer">
                       <UserCheck />
                       <span>teachers</span>
                     </SheetClose>
                   </Link>
                   <Link to="subjects">
                     <SheetClose className="flex items-center space-x-2 cursor-pointer">
                       <BookOpen />
                       <span>subjects</span>
                     </SheetClose>
                   </Link>
                   <Link to="enrolls">
                     <SheetClose className="flex items-center space-x-2 cursor-pointer">
                       <ClipboardPenLine />
                       <span>enrollments</span>
                     </SheetClose>
                   </Link>
                   <Link to="results">
                     <SheetClose className="flex items-center space-x-2 cursor-pointer">
                       <Trophy/>
                       <span>results</span>
                     </SheetClose>
                   </Link>
                   <Link to="roles">
                     <SheetClose className="flex items-center space-x-2 cursor-pointer">
                       <ShieldUser/>
                       <span>roles</span>
                     </SheetClose>
                   </Link>
                   
                 </div>

                 <div className="flex items-center p-2">
                   <div className="h-12 w-12 flex justify-center  rounded-full bg-blue-500 mr-1">
                     <span className="text-4xl text-white "> {user?.name[0].toUpperCase()}</span>
                   </div>
                   <div className="flex flex-col overflow-hidden">
                     <span className="font-medium text-lg text-blue-600">{user?.name}</span>
                     <span className="text-md text-blue-600">{user?.email}</span>
                   </div>
                 </div>
                 <div className="p-2 ">
                   <Button onClick={handleLogout} className="p-4 rounded-md cursor-pointer">
                     <LogOut />
                     Logout
                   </Button>
                 </div>
               </SheetHeader>
             </SheetContent>
           </Sheet>
           <div className="flex items-center space-x-4 mr-5">
             
             <div className="h-9 w-9 flex justify-center  rounded-full bg-blue-400">
                 <span className="text-2xl text-white"> {user?.name[0].toUpperCase()}</span>
               </div>
           </div>
         </div>

         {/* main component */}

         <div className="bg-card">
           <Outlet />
         </div>
       </div>
     </div>
    

  )
}

export default ViceDashboard