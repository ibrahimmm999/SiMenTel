import Button from "../../components/button";
import Textfield from "../../components/textfield";

function Login() {
  const onLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex h-screen w-full flex-col justify-center bg-[url(/assets/background.svg)] bg-cover bg-center px-5 md:px-[20%] lg:px-[30%]">
      <form
        onSubmit={(e) => onLogin(e)}
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
        <Textfield required type={"field"} placeholder={"Your username"} />
        <Textfield required type={"password"} placeholder={"Your password"} />
        <div>
          <Button
            type="submit"
            color="primary"
            isLoading={false}
            text="Login"
          />
        </div>
      </form>
    </div>
  );
}

export default Login;
