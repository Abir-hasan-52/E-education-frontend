import { useEffect, useState } from "react";
import useAuth from "./useAuth";
// import useAxiosSecure from "./useAxiosSecure";
import useAxiosPublic from "./useAxiosPublic";

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  //   const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();

  const [role, setRole] = useState(null); // "admin" / "student" / null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // jodi auth e loading cholche ba user nai — wait
    if (authLoading) return;
    if (!user?.email) {
      setRole(null);
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axiosPublic.get(`/api/users/role/${user.email}`);
        setRole(res.data.role); // "admin" or "student"
      } catch (err) {
        console.error("Role fetch error:", err);
        setError(err?.response?.data?.message || "Failed to load user role");
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [user, authLoading, axiosPublic]);

  return {
    role,
    RoleLoading: loading,
    error,
    isAdmin: role === "admin",
    isStudent: role === "student",
  };
};

export default useUserRole;
