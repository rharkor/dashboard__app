import { FC, FormEventHandler, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { Password } from "primereact/password";
import { useAuth } from "@/contexts/AutchContext";

const Login: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  const containerClassName = classNames(
    "surface-ground flex justify-center items-center min-h-screen min-w-screen overflow-hidden h-full w-full"
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className={containerClassName}>
      <div
        style={{
          borderRadius: "56px",
          padding: "0.3rem",
          background:
            "linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)",
        }}
      >
        <form
          className="w-full surface-card py-8 px-5 sm:px-8"
          style={{
            borderRadius: "53px",
            background: "var(--surface-section)",
          }}
          onSubmit={handleSubmit}
        >
          <div>
            <label
              htmlFor="email"
              className="block text-900 text-xl font-medium mb-2"
            >
              Email
            </label>
            <InputText
              id="email"
              type="text"
              placeholder="Email address"
              className="w-full md:w-30rem"
              style={{ padding: "1rem", marginBottom: "1rem" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label
              htmlFor="password"
              className="block text-900 font-medium text-xl mb-2"
            >
              Password
            </label>
            <Password
              inputId="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              toggleMask
              className="w-full mb-5"
              inputClassName="w-full p-3 md:w-30rem"
              feedback={false}
            ></Password>
            <Button
              label="Sign In"
              className="w-full p-3 text-xl"
              type="submit"
            ></Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
