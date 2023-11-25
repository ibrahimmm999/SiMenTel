import { useState } from "react";
import Button from "../../components/button";
import Textfield from "../../components/textfield";
import { toastError, toastSuccess } from "../../components/toast";
import { supabase } from "../../lib/api";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsLoading(false);

    if (data.session) {
      Cookies.set("token_simentel", data.session.access_token);
      toastSuccess("Login successfully");
      navigate("/");
    }

    if (error) {
      toastError(error.message);
    } else if (!data && !error) {
      toastError("An email has been sent to you for verification!");
    }
  };

  return (
    <div className="flex h-screen w-full flex-col justify-center bg-[url(/assets/background.svg)] bg-cover bg-center px-5 md:px-[20%] lg:px-[30%]">
      <form
        onSubmit={(e) => handleLogin(e)}
        className="flex h-auto w-full flex-col items-center rounded-3xl bg-mono-white px-8 md:px-16 xl:px-[100px] py-14 gap-6 xl:gap-8"
      >
        <div className="flex flex-col items-center">
          <img
            src="./assets/logo_large.svg"
            alt="SiMentel"
            className="w-[100px] bg-cover"
          />
          <h1 className="text-mono-darkGrey font-bold text-[36px] xl:text-[64px] -mb-2 xl:-mb-5">
            SiMenTel
          </h1>
          <p className="text-mono-darkGrey text-[16px] xl:text-[24px]">
            Sistem Manajemen Hostel
          </p>
        </div>
        <Textfield
          required
          value={email}
          type={"email"}
          placeholder={"Your email"}
          onChange={(val) => setEmail(val.target.value)}
        />
        <Textfield
          required
          value={password}
          type={"password"}
          placeholder={"Your password"}
          onChange={(val) => setPassword(val.target.value)}
        />
        <div>
          <Button
            type="submit"
            color="primary"
            isLoading={isLoading}
            text="Login"
          />
        </div>
      </form>
    </div>
  );
}

export default Login;
