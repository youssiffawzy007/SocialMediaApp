import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@heroui/react";
import { useContext } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import { TokenContext } from "../../../context/TokenContext";
import { House, MessageCircle, UserRound } from "lucide-react";

const AcmeLogo = () => {
  return (
    <img
      src="https://route-posts.routemisr.com/route.png"
      className="w-9 h-9 rounded-lg me-1.5 shrink-0"
      alt="route logo"
    />
  );
};

export default function NavBar() {
  const { pathname } = useLocation();
  
  const isMatch =
    pathname.startsWith("/MyPosts") ||
    pathname.startsWith("/Community") ||
    pathname.startsWith("/Saved");
  const { UserData, deleteUser } = useContext(UserContext);
  const { deleteToken } = useContext(TokenContext);
  const navigate = useNavigate();
  function logOut() {
    deleteToken();
    deleteUser();
    navigate("/login");
  }
  return (
    <div className=" bg-white h-16 fixed top-0 right-0 left-0 z-50">
      <Navbar maxWidth="xl" className=" container mx-auto w-full ">
        <NavbarBrand>
          <AcmeLogo />
          <p className="font-bold text-inherit hidden md:inline">Route Posts</p>
        </NavbarBrand>

        <NavbarContent
          className="flex gap-4 bg-gray-50 h-fit px-2.5 py-1 border border-gray-200 box-border rounded-2xl"
          justify="center"
        >
          <NavbarItem>
            <NavLink
              to="/"
              color="foreground"
              className={`px-3.5 py-3 box-border rounded-xl font-semibold text-sm flex justify-between items-center text-gray-700 hover:text-black transition-all hover:bg-white/75 ${isMatch && "active"} `}
            >
              <House size={20} />
              <span className="ms-1 hidden sm:inline">Feed</span>
            </NavLink>
          </NavbarItem>
          <NavbarItem>
            <NavLink
              to="/profile"
              aria-current="page"
              color="secondary"
              className="px-3.5 py-3 box-border rounded-xl font-semibold text-sm flex justify-between items-center text-gray-700 hover:text-black transition-all hover:bg-white/75"
            >
              <UserRound size={20} />
              <span className="ms-1 hidden sm:inline">Profile</span>
            </NavLink>
          </NavbarItem>
          <NavbarItem>
            <NavLink
              to="/notifications"
              color="foreground"
              className="px-3.5 py-3 box-border rounded-xl font-semibold text-sm flex justify-between items-center text-gray-700 hover:text-black transition-all hover:bg-white/75"
            >
              <MessageCircle size={20} />
              <span className="ms-1 hidden sm:inline">Notifications</span>
            </NavLink>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent as="div" justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform cursor-pointer"
                color="secondary"
                name="Jason Hughes"
                size="sm"
                src={UserData?.photo}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">zoey@example.com</p>
              </DropdownItem>
              <DropdownItem key="settings">My Settings</DropdownItem>
              <DropdownItem key="team_settings">Team Settings</DropdownItem>
              <DropdownItem key="analytics">Analytics</DropdownItem>
              <DropdownItem key="system">System</DropdownItem>
              <DropdownItem key="configurations">Configurations</DropdownItem>
              <DropdownItem key="help_and_feedback">
                Help & Feedback
              </DropdownItem>
              <DropdownItem onClick={logOut} key="logout" color="danger">
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <p className="font-semibold text-sm text-gray-700 hidden md:inline">
            {UserData?.name}
          </p>
        </NavbarContent>
      </Navbar>
    </div>
  );
}
