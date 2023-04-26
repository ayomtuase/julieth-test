import addUserDoc from "@/src/addUser";
import { auth } from "@/src/firebase";
import { emailRegex } from "@/src/utils";
import { FirebaseError } from "firebase/app";
import logo from "@/src/assets/images/logo.svg";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import Image from "next/image";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { ImSpinner8 } from "react-icons/im";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";

interface RegistrationForm {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Home() {
  const googleAuthProvider = new GoogleAuthProvider();
  const [user, authLoading] = useAuthState(auth);
  const [authErrorMesage, setAuthErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<RegistrationForm>();

  const onSubmit = async (data: RegistrationForm) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data?.email,
        data?.password
      );
      addUserDoc(userCredential?.user, setAuthErrorMessage);
      reset();
      setAuthErrorMessage("");
    } catch (error: unknown) {
      setAuthErrorMessage((error as FirebaseError)?.message);
      return;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;

      addUserDoc(user, setAuthErrorMessage);
    } catch (error) {
      setAuthErrorMessage((error as FirebaseError)?.message);
      return;
    }
  };

  return (
    <main className="w-screen min-h-screen lg:h-screen flex flex-col-reverse md:flex-row">
      <div className="flex-grow py-7 w-full lg:w-1/2 flex justify-center flex-col h-full bg-[linear-gradient(90deg,#3b124f,#301d35)] px-3 md:px-[50px]">
        <Image src={logo} alt="Julieth" />
        <h3 className="font-bold text-2xl md:text-5xl md:text-[50px] text-[#cecece] mt-4">
          Answer all your tech startup questions
        </h3>
      </div>

      <div className="py-10 w-full lg:w-1/2 flex justify-center h-full bg-[#130f26]">
        <div className="w-11/12 lg:w-1/2 flex flex-col items-center justify-center">
          <h3 className="text-center bg-[linear-gradient(#009afc,#b658ff)] mb-5 bg-clip-text text-[40px] leading-normal font-bold fill-color-transparent">
            Sign up
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

            <div className="flex flex-col space-y-2 w-full mb-5 items-start">
              <label htmlFor="confirmPassword" className="text-white">Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="text-white focus-visible:outline-none w-full text-xl p-2.5 border-solid border-2 bg-[#d9d9d933] border-[#5c0095]"
                placeholder="Confirm your password"
                {...register("confirmPassword", {
                  required: `Confirm Password is required`,
                  validate: (val: string) => {
                    if (watch("password") != val) {
                      return "Your passwords do not match";
                    }
                  },
                })}
              />
              {errors?.confirmPassword && (
                <span className="my-2 text-13px text-skin-red text-opacity-70">
                  {errors?.confirmPassword?.message}
                </span>
              )}
            </div>

            {authErrorMesage ? <p>{authErrorMesage}</p> : null}
            <button
              type="submit"
              className="cursor-pointer bg-[linear-gradient(90deg,#9747ff,#fc00b5)] w-full text-white py-2.5 font-semibold text-xl"
            >
              Sign up
            </button>
          </form>
          <p className="text-center mt-4 text-white">
            Already have an account?{" "}
            <Link href="/" className="underline">
              Login in
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
                <span className="ml-2">Sign up with Google</span>
              </span>
            )}{" "}
          </button>
        </div>
      </div>
    </main>

    // <main>
    //   <form onSubmit={handleSubmit(onSubmit)}>
    //     <div>
    //       <label htmlFor="email">Email Address</label>
    //       <input
    //         type="email"
    //         id="email"
    //         placeholder="janedoe@gmail.com"
    //         {...register("email", {
    //           required: "Email is required",
    //           pattern: {
    //             value: emailRegex,
    //             message: "Please enter a valid email address",
    //           },
    //         })}
    //       />
    //       {errors?.email && (
    //         <span className="my-2 text-13px text-skin-red text-opacity-70">
    //           {errors?.email?.message}
    //         </span>
    //       )}
    //     </div>
    //     <div>
    //       <label htmlFor="password">Password</label>
    //       <input
    //         type="password"
    //         id="password"
    //         placeholder="Enter your password"
    //         {...register("password", { required: "Password is required" })}
    //       />
    //       {errors?.password && (
    //         <span className="my-2 text-13px text-skin-red text-opacity-70">
    //           {errors?.password?.message}
    //         </span>
    //       )}
    //     </div>
    //     <div>
    //       <label htmlFor="confirmPassword">Password</label>
    //       <input
    //         type="password"
    //         id="confirmPassword"
    //         placeholder="Confirm your password"
    //         {...register("confirmPassword", {
    //           required: `Confirm Password is required`,
    //           validate: (val: string) => {
    //             if (watch("password") != val) {
    //               return "Your passwords do not match";
    //             }
    //           },
    //         })}
    //       />
    //       {errors?.confirmPassword && (
    //         <span className="my-2 text-13px text-skin-red text-opacity-70">
    //           {errors?.confirmPassword?.message}
    //         </span>
    //       )}
    //     </div>
    //     {authErrorMesage ? <p>{authErrorMesage}</p> : null}
    //     <button type="submit">
    //       {" "}
    //       {authLoading ? <ImSpinner8 /> : "Submit"}{" "}
    //     </button>
    //   </form>

    //   <button onClick={signInWithGoogle}>Sign in with Google</button>

    //   {user ? (
    //     <div>
    //       <p>{`Welcome to Julieth, ${user.displayName || user.email}`}</p>
    //       <button
    //         onClick={() => {
    //           auth.signOut();
    //         }}
    //       >
    //         Log out
    //       </button>
    //     </div>
    //   ) : null}
    // </main>
  );
}
