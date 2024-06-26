import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { selectUser, setUser } from "./store/slices/userAuthSlice";

import RootLayout from "./pages/Root";

import ErrorPage from "./pages/Error";

import FAQPage from "./pages/FAQ";
import FAQItem from "./pages/FAQItem";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import MyComplaints from "./pages/MyComplaints";
import CreateComplaint from "./pages/CreateComplaint";
import Complaint from "./pages/Complaint";

import AdminPage from "./pages/admin/AdminPage";
import AdminLogIn from "./pages/admin/LogIn";
import Dashboard from "./pages/admin/Dashboard";
import Admins from "./pages/admin/Admins";
import Users from "./pages/admin/Users";
import Complaints from "./pages/admin/Complaints";
import Categories from "./pages/admin/Categories";
import AdminComplaint from "./pages/admin/Complaint";
import ChatbotComponent from "./components/ChatBot/ChatbotComponent";
import UpdateUser from "./pages/admin/UpdateUser";
import UpdateCategory from "./pages/admin/UpdateCategory";

const App = () => {
	const [isLoading, setIsLoading] = useState(true);
	const user = useSelector(selectUser);
	const isAdmin = user?.role === "admin";

	const dispatch = useDispatch();
	const localToken = localStorage.getItem("token");
	useEffect(() => {
		if (!localToken) {
			setIsLoading(false);
			return;
		}
		const fetchToken = async () => {
			try {
				const response = await axios.post(
					"http://127.0.0.1:5000/api/v1/validateToken",
					{
						token: localToken,
					}
				);
				dispatch(setUser(response.data.userData));
			} catch (error) {
				console.error(error);
			}
			setIsLoading(false);
		};
		fetchToken();
	}, [dispatch, localToken]);

	if (isLoading) return;

	return (
		<Routes>
			<Route path="*" element={<ErrorPage />} />
			<Route
				path="/"
				element={isAdmin ? <Navigate to="/admin/dashboard" /> : <RootLayout />}
			>
				<Route
					index={true}
					element={
						!user ? (
							<Navigate to="/login" />
						) : (
							<Navigate to="/my-complaints/1" />
						)
					}
				/>
				<Route
					path="/login"
					element={!user ? <LogIn /> : <Navigate to="/my-complaints/1" />}
				/>
				<Route
					path="/signup"
					element={!user ? <SignUp /> : <Navigate to="/my-complaints/1" />}
				/>
				<Route
					path="/create-complaint"
					element={!user ? <Navigate to="/login" /> : <CreateComplaint />}
				/>
				<Route
					path="/my-complaints/:page?"
					element={!user ? <Navigate to="/login" /> : <MyComplaints />}
				/>
				<Route
					path="/complaint/:complaintId"
					element={!user ? <Navigate to="/login" /> : <Complaint />}
				/>
				<Route
					path="/chatbot"
					element={!user ? <Navigate to="/login" /> : <ChatbotComponent />}
				/>
				<Route path="/faq">
					<Route index={true} element={<FAQPage />} />
					<Route path=":item" element={<FAQItem />} />
				</Route>
			</Route>
			<Route path="/users/:id" element={<UpdateUser />} />
			<Route path="/categories/:categoryId" element={<UpdateCategory />} />
			<Route path="/admin">
				<Route
					index={true}
					element={
						isAdmin ? (
							<Navigate to="/admin/dashboard" />
						) : (
							<Navigate to="/admin/login" />
						)
					}
				/>
				<Route
					path="login"
					element={
						isAdmin ? <Navigate to="/admin/dashboard" /> : <AdminLogIn />
					}
				/>
				<Route
					element={isAdmin ? <AdminPage /> : <Navigate to="/admin/login" />}
				>
					<Route path="dashboard" element={<Dashboard />} />
					<Route path="admins" element={<Admins />} />
					<Route path="users/:page?" element={<Users />} />
					<Route path="categories" element={<Categories />} />
					<Route path="complaints/:page?" element={<Complaints />} />
					<Route path="complaint/:id" element={<AdminComplaint />} />
				</Route>
			</Route>
		</Routes>
	);
};

export default App;
