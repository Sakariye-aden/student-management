import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api/apiStore";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";

type User = {
  _id: string;
  name: string;
  role: string;
};

type UsersResponse = {
  users: User[];
  page: number;
  totalPages: number;
};

const Roles = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  // Fetch users with pagination
  const { data, isLoading } = useQuery<UsersResponse>({
    queryKey: ["users", page],
    queryFn: async () => {
      const response = await api.get(`/Auth/users?page=${page}&limit=10`);
      return response.data as UsersResponse;
    },
    placeholderData: (prev) => prev, // replaces keepPreviousData in v5
  });

  // update mutation
  const mutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const response = await api.put(`/admin/${id}`, { role });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", page] });
      toast.success('users role successfully updated')
    },
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader className="animate-spin text-3xl" />
      </div>
    );
  }

  const roles = [
    "student",
    "teacher",
    "dean of students",
    "vice principal",
    "principal",
  ];

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Roles & Permissions</h1>
      <h2 className="my-2 text-lg">The Roles and Permissions page allows the vice principal to manage user roles with in the system </h2>
      <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg shadow-md">
        <table className="min-w-full border border-gray-200 rounded-lg shadow-md ">
          <thead className="bg-gray-100 text-blue-600 sticky top-0">
            <tr className="bg-gray-100">
              <th className="border p-2">Name</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data?.users.map((user: User) => (
              <tr key={user._id}
                className="hover:bg-blue-100 transition-colors duration-200 text-blue-600"
               >
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.role}</td>
                <td className="border p-2">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      mutation.mutate({ id: user._id, role: e.target.value })
                    }
                    className="border rounded p-1"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-4 py-2 bg-violet-600 text-white rounded-md disabled:opacity-50"
        >
          Prev
        </button>

        <span className="border text-center p-2 rounded-md">
          Page {data?.page} of {data?.totalPages}
        </span>

        <button
          disabled={page === data?.totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-800 text-white rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Roles;
