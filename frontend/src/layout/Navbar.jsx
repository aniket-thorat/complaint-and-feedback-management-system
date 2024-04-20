import { FaBars } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { guestNavLinks, userNavLinks } from "../data/lists";
import NavbarLink from "../components/Navbar/NavbarLink";
import { logout, selectUser } from "../store/slices/userAuthSlice";
import logOutImage from "../assets/logout.png"
import chatbotImage from "../assets/chatbot.png"

const Navbar = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const user = useSelector(selectUser);

	const [showLinks, setShowLinks] = useState(false);

	const toggleLinks = () => {
		setShowLinks(!showLinks);
	};

	const logoutHandler = () => {
		dispatch(logout());
		navigate("/login");
	};
	const chatbotHandler = () => {
		navigate("/chatbot");
	};
	return (
		<nav className="absolute pt-5 pb-5 z-[50] w-full px-10 sm:px-16 md:px-28 lg:px-40 xl:px-60 py-4 flex flex-row items-center justify-between bg-gray-900 text-white font-semibold">
			<Link to="/" className="text-lg lg:text-xl">
				MACCROS
			</Link>
			{showLinks && (
				<div
					className="fixed inset-0 z-30 bg-black bg-opacity-60 cursor-pointer"
					onClick={toggleLinks}
				/>
			)}

			<div
				className={`fixed lg:static top-0 left-0 h-screen lg:h-auto pt-14 px-8 lg:p-0 lg:flex lg:flex-row bg-white lg:bg-transparent text-black lg:text-gray-200 shadow-lg lg:shadow-none transition-all duration-500 ease-in-out z-40 ${showLinks ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
					}`}
			>
				<div className="lg:hidden mb-5 flex flex-row justify-between text-lg text-gray-600 font-semibold">
					<h2>TestApp</h2>
					<IoClose
						className="cursor-pointer transition duration-300 hover:text-sky-500"
						onClick={toggleLinks}
					/>
				</div>
				<div className="border-b lg:border-b-0 border-b-500 mb-5"></div>
				<ul className="flex flex-col space-y-2 lg:space-y-0 lg:flex-row lg:gap-4 text-base lg:text-lg font-medium">
				{user && (
						<li
							className={`cursor-pointer ${showLinks && "text-gray-400"}`}
							onClick={chatbotHandler}
						>
							<img src={chatbotImage} style={{height:"35px", width:"40px"}} title="Chat"/>
						</li>
					)}
					
					{user
						? userNavLinks.map((navLink, index) => (
							<NavbarLink
								key={index}
								path={navLink.path}
								text={navLink.text}
								setShowLinks={setShowLinks}
							/>
						))
						: guestNavLinks.map((navLink, index) => (
							<NavbarLink
								key={index}
								path={navLink.path}
								text={navLink.text}
								setShowLinks={setShowLinks}
							/>
						))}
					{user && (
						<li
							className={`cursor-pointer ${showLinks && "text-gray-400"}`}
							onClick={logoutHandler}
						>
							{/* Logout */}
							<img src={logOutImage} style={{height:"30px", width:"30px"}} title="Logout"/>
						</li>
					)}
				</ul>
			</div>

			<button
				className="lg:hidden text-lg text-gray-200 transition duration-500 hover:text-white"
				onClick={toggleLinks}
			>
				<FaBars />
			</button>
		</nav>
	);
};

export default Navbar;
