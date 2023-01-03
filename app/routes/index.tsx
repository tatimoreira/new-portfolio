import { Link } from "@remix-run/react";
import { DateTime } from "luxon";
import Navbar from "~/components/navigation/NavBar";
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
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
            <div className="relative px-4 pt-16 pb-8 sm:px-6 sm:pt-24 sm:pb-14 lg:px-8 lg:pb-20 lg:pt-32">
              <span>📍 🇨🇷 Costa Rica</span>
              <span>{` / ${time.hour}:${time.minute}`}</span>

              <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-5xl">
                <span className="block uppercase text-yellow-500 drop-shadow-md">
                  Tatiana Moreira
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-lg text-center text-xl text-black sm:max-w-3xl">
                Creating software for cool people
              </p>
              <p className="mx-auto mt-6 max-w-lg text-center text-xl text-black sm:max-w-3xl">
                Curious software engineer obsessed with everything web. Always
                seeking out the cutting edge in my craft.
              </p>
              <p className="mx-auto mt-6 max-w-lg text-center text-xl text-black sm:max-w-3xl">
                Currently at Parsley.
              </p>

              <a href="https://remix.run">
                <img
                  src="https://user-images.githubusercontent.com/1500684/158298926-e45dafff-3544-4b69-96d6-d3bcc33fc76a.svg"
                  alt="Remix"
                  className="mx-auto mt-16 w-full max-w-[12rem] md:max-w-[16rem]"
                />
              </a>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-7xl text-center">
          <Navbar links={routes} />
        </div>
      </div>
    </main>
  );
}
