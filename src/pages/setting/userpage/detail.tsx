import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import UserService from "@src/services/identity/UserService";
import { IUser } from "@src/commons/interfaces";
import { NextApplicationPage } from "@src/pages/_app";

const StaffDetail: NextApplicationPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      setLoading(true);
      UserService.getUserDetail(id as string, "organizationId")
        .then((data) => {
          setUser(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching staff details:", err);
          setError("Failed to load staff details.");
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>No user found.</div>;
  }

  return (
    <div>
      <h1>{user.fullName}</h1>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default StaffDetail;
