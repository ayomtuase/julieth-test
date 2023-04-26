import logo from "@/src/assets/images/logo.svg";
import { auth } from "@/src/firebase";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const Dashboard = () => {
  const [user, authLoading] = useAuthState(auth);
  const router = useRouter();

  const logout = () => {
    auth.signOut();
    router.push("/");
  };

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <main className="w-screen min-h-screen lg:h-screen flex flex-col-reverse lg:flex-row">
      <div className="py-7 w-full lg:w-1/2 flex justify-center flex-col h-full bg-[linear-gradient(90deg,#3b124f,#301d35)] px-3 md:px-[50px]">
        <Image src={logo} alt="Julieth" />
        <h3 className="font-bold text-2xl md:text-5xl md:text-[50px] text-[#cecece] mt-4">
          Answer all your tech startup questions
        </h3>
      </div>

      <div className="py-10 w-full lg:w-1/2 flex flex-grow justify-center h-full bg-[#130f26]">
        <div className="w-11/12 lg:w-1/2 flex flex-col items-center justify-center">
          <h3 className="text-center bg-[linear-gradient(#009afc,#b658ff)] mb-5 bg-clip-text text-2xl md:text-[40px] leading-normal font-bold fill-color-transparent">
            Welcome, {user?.displayName || user?.email}
          </h3>

          <button
            onClick={logout}
            className="cursor-pointer bg-[linear-gradient(90deg,#9747ff,#fc00b5)] w-full text-white py-2.5 font-semibold text-xl"
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
