import { DateTime } from "luxon";
import Navbar from "../components/navigation/Navbar";
import { FaHome } from "react-icons/fa";
import { FaLightbulb } from "react-icons/fa";

export const routes = [
  { to: "/", label: "HOME", icon: FaHome },
  { to: "/posts", label: "POSTS", icon: FaLightbulb },
];

export default function Index() {
  var time = DateTime.local().setZone("America/Costa_Rica");
  console.log(time);
  return (
    <main className="relative  min-h-screen  bg-blue-700 backdrop-blur-sm sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="max-w-7xl p-3 ">
          {/* <span>📍 🇨🇷 Costa Rica</span>
          <span>{` / ${time.hour}:${time.minute}`}</span> */}
          <div className="relative overflow-hidden rounded-2xl bg-amber-300 p-5 shadow-xl">
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
        </div>
        <div className=" max-w-7xl p-3 ">
          <Navbar links={routes} />
        </div>
      </div>
    </main>
  );
}
