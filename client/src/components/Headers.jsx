import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="bg-blue-900 py-2 px-2 sm:px-8 flex justify-between items-center">
      <Link to={"/"} className="flex gap-2 items-center">
        <img src="logo.png" alt="" className="h-[50px] " />
        <span className="text-2xl text-white   font-bold">Voxa24</span>
      </Link>
      <div className="items-center gap-4 hidden sm:flex">
        {/* <Link to={""} className="text-white underline hover:text-yellow-400">
          Link1
        </Link>
        <Link to={""} className="text-white underline hover:text-yellow-400">
          Link1
        </Link>
        <Link to={""} className="text-white underline hover:text-yellow-400">
          Link1
        </Link>
        <Link to={""} className="text-white underline hover:text-yellow-400">
          Link1
        </Link> */}
      </div>

      <Link
        to={"/login"}
        className="text-white  hover:underline bg-gradient-to-b from-[#F57B6F] to-[#FEACA3] rounded-md py-2 px-6 mr-4"
      >
        Client Login
      </Link>

      {!menuOpen ? (
        <GiHamburgerMenu
          className="hidden text-white text-3xl"
          onClick={() => setMenuOpen(true)}
        />
      ) : (
        <div className="sm:hidden fixed inset-0 right-0 w-screen h-screen flex flex-col gap-6 bg-black/80 p-10">
          <RxCross2
            className="sm:hidden text-3xl text-white self-end"
            onClick={() => setMenuOpen(false)}
          />
          {/* <Link to={""} className="text-white underline hover:text-yellow-400">
            Link1
          </Link>
          <Link to={""} className="text-white underline hover:text-yellow-400">
            Link1
          </Link>
          <Link to={""} className="text-white underline hover:text-yellow-400">
            Link1
          </Link>
          <Link to={""} className="text-white underline hover:text-yellow-400">
            Link1
          </Link> */}

          <Link
            to={"/login"}
            className="text-white  hover:underline bg-gradient-to-b from-[#F57B6F] to-[#FEACA3] rounded-md py-2 px-6 mr-4 w-fit"
          >
            Client Login
          </Link>
        </div>
      )}
    </div>
  );
}
