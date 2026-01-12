import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState, ChangeEvent } from "react";
import { axiosProtected } from "@/lib/axios";
import { User } from "@/types";
import {
  Pencil,
  Trash2,
  ShieldCheck,
  User as UserIcon,
  XCircle,
  CheckCircle,
} from "lucide-react";

// Define user interface

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosProtected.get("/v1/user");
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      setLoading(true);
      const response = await axiosProtected.delete(`/v1/user/${id}`);

      if (response.data && response.status === 200) {
        toast.success("User deleted successfully");
        await fetchUsers(); // Refresh the list after delete
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (err: any) {
      console.error("Failed to delete user:", err);

      // Get the error message from the response if possible
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete user. Please try again.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (selectedUser) {
      setSelectedUser((prev) => (prev ? { ...prev, [name]: value } : null));
    }
  };

  const submitUpdate = async () => {
    if (!selectedUser) return;
    setIsSubmitting(true);

    try {
      const response = await axiosProtected.put(
        `/v1/user/${selectedUser._id}`,
        selectedUser
      );

      if (response.data && response.status === 200) {
        toast.success("User updated successfully");
        setEditModalOpen(false);
        await fetchUsers(); // Refresh the list after update
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (err: any) {
      console.error("Failed to update user:", err);

      // Get the error message from the response if possible
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update user. Please try again.";

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 relative bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <LoadingOverlay isLoading={loading} text="Loading users..." />

      <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
        Manage Users
      </h2>
      <p className="text-gray-600 text-center mb-8">
        View, edit, or remove users from your platform
      </p>
      <Card className="shadow-xl w-full">
        <CardContent className="p-0">
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {users?.map((user, index) => (
                  <tr
                    key={user._id}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-blue-400" /> {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {user.role === "admin" ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <ShieldCheck className="h-4 w-4 mr-1 text-yellow-500" />{" "}
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <UserIcon className="h-4 w-4 mr-1 text-blue-500" />{" "}
                          User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {user.userStatus === "active" ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="h-4 w-4 mr-1 text-green-500" />{" "}
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircle className="h-4 w-4 mr-1 text-red-500" />{" "}
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                      <Button
                        onClick={() => handleUpdate(user)}
                        variant="outline"
                        className="text-blue-600 hover:bg-blue-100"
                        size="icon"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(user._id)}
                        variant="destructive"
                        className="hover:bg-red-100"
                        size="icon"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-blue-700">
              Edit User Details
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    name="name"
                    value={selectedUser.name}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <Label>Role</Label>
                  <Select
                    value={selectedUser.role}
                    onValueChange={(value: "user" | "admin") =>
                      setSelectedUser((prev) =>
                        prev ? { ...prev, role: value } : null
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select
                    value={selectedUser.userStatus}
                    onValueChange={(value: "active" | "inactive") =>
                      setSelectedUser((prev) =>
                        prev
                          ? {
                              ...prev,
                              userStatus: value,
                            }
                          : null
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="pt-4 text-right">
                <Button
                  onClick={submitUpdate}
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? "Updating..." : "Update User"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* For the edit modal - show a loading overlay when submitting */}
      {isSubmitting && (
        <LoadingOverlay isLoading={true} text="Updating user..." />
      )}
    </div>
  );
}
