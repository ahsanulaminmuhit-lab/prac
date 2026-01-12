import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function ProfileCard() {
  const { user } = useAuth();

  if (!user) {
    return null; // Don't show anything if user is not authenticated
  }

  return (
    <motion.div
      className="flex items-center justify-center w-full mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full shadow-xl rounded-xl">
        <CardContent className="flex flex-col items-center p-8">
          {/* User avatar - either photo or icon */}
          {user.photo ? (
            <img
              src={user.photo}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 mb-4 shadow"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4 border-4 border-blue-100 shadow">
              <User className="w-12 h-12 text-blue-600" />
            </div>
          )}

          {/* User info */}
          <h2 className="text-2xl font-bold text-gray-800 mb-1">{user.name}</h2>
          <p className="text-gray-500 mb-2">{user.email}</p>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm mb-2">
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
        </CardContent>
      </Card>
    </motion.div>
  );
}
