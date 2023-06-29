import { Outlet } from "@remix-run/react";

export default function Index() {
  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl bg-amber-300 p-12 shadow-xl">
        <div className="relative ">
          <h1 className="text-center text-6xl font-extrabold tracking-tight text-white sm:text-8xl lg:text-5xl">
            <span className="mt-12 block uppercase drop-shadow-md">
              Tatiana Moreira
            </span>
          </h1>
          <div className="text-center text-white">
            <p className="mx-auto mt-6 max-w-lg  text-xl  sm:max-w-3xl">
              Creating software for cool people
            </p>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
