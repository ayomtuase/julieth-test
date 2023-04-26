import logo from "@/src/assets/images/logo.svg";
import { auth } from "@/src/firebase";
import { emailRegex } from "@/src/utils";
import { FirebaseError } from "firebase/app";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";

interface LoginForm {
  email: string;
  password: string;
}

export default function Home() {
  const googleAuthProvider = new GoogleAuthProvider();
  const [user, authLoading] = useAuthState(auth);
  const [authErrorMesage, setAuthErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginForm>();

  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const onSubmit = async (data: LoginForm) => {
    try {
      await signInWithEmailAndPassword(auth, data?.email, data?.password);
      reset();
      setAuthErrorMessage("");
      router.push("/dashboard");
    } catch (error: unknown) {
      setAuthErrorMessage((error as FirebaseError)?.message);
      return;
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
      router.push("/dashboard");
    } catch (error) {
      setAuthErrorMessage((error as FirebaseError)?.message);
      return;
    }
  };

  return (
    <main className="lg:fixed w-screen min-h-screen lg:h-screen flex flex-col-reverse lg:flex-row">
      <div className="flex-grow py-7 w-full lg:w-1/2 flex justify-center flex-col h-full bg-[linear-gradient(90deg,#3b124f,#301d35)] px-3 md:px-[50px]">
        <Image src={logo} alt="Julieth" />
        <h3 className="font-bold text-2xl md:text-5xl md:text-[50px] text-[#cecece] mt-4">
          Imagine a world where you can quickly learn tech skills powered by AI
        </h3>
      </div>

      <div className="w-full lg:w-1/2 flex justify-center min-h-screen lg:h-auto lg:overflow-auto bg-[#130f26]">
        <div className="py-10 lg:h-fit w-11/12 lg:w-1/2 flex flex-col items-center justify-center">
          <h3 className="text-center bg-[linear-gradient(#009afc,#b658ff)] mb-5 bg-clip-text text-[40px] leading-normal font-bold fill-color-transparent">
            Login
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="flex flex-col space-y-2 w-full mb-5 items-start">
              <label htmlFor="email" className="text-white">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="text-white focus-visible:outline-none w-full text-xl p-2.5 border-solid border-2 bg-[#d9d9d933] border-[#5c0095]"
                placeholder="janedoe@gmail.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: emailRegex,
                    message: "Please enter a valid email address",
                  },
                })}
              />
              {errors?.email && (
                <span className="my-2 text-13px" style={{ color: "red" }}>
                  {errors?.email?.message}
                </span>
              )}
            </div>
            <div className="flex flex-col space-y-2 w-full mb-5 items-start">
              <label htmlFor="password" className="text-white">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="text-white focus-visible:outline-none w-full text-xl p-2.5 border-solid border-2 bg-[#d9d9d933] border-[#5c0095]"
                placeholder="Enter your password"
                {...register("password", { required: "Password is required" })}
              />
              {errors?.password && (
                <span className="my-2 text-13px" style={{ color: "red" }}>
                  {errors?.password?.message}
                </span>
              )}
            </div>
            {authErrorMesage ? (
              <p
                className="my-2 text-13px text-center"
                style={{ color: "red" }}
              >
                {authErrorMesage}
              </p>
            ) : null}
            <button
              type="submit"
              className="cursor-pointer bg-[linear-gradient(90deg,#9747ff,#fc00b5)] w-full text-white py-2.5 font-semibold text-xl"
            >
              Login
            </button>
          </form>
          <p className="text-center mt-4 text-white">
            Are you a new user?{" "}
            <Link href="/create" className="underline">
              Create Account
            </Link>
          </p>

          <div className="flex space-x-2 my-5 w-full items-center">
            <hr
              style={{ height: "2px", color: "white" }}
              className="flex-grow"
            />
            <span className="font-medium text-white">OR</span>
            <hr
              style={{ height: "2px", color: "white" }}
              className="flex-grow"
            />
          </div>

          <button
            onClick={signInWithGoogle}
            className="cursor-pointer bg-[linear-gradient(90deg,#9747ff,#fc00b5)] w-full text-white py-2.5 font-semibold text-xl"
          >
            {authLoading ? (
              <ImSpinner8 className="" />
            ) : (
              <span className="inline-flex items-center justify-center w-full">
                <FaGoogle />
                <span className="ml-2">Sign in with Google</span>
              </span>
            )}{" "}
          </button>
        </div>
      </div>
    </main>
  );
}
