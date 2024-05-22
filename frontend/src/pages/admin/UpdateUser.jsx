import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const UpdateUser = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: '',
    });
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/api/v1/users/${id}`)
          .then(res => {
            const { email, firstName, lastName, phone, role } = res.data;
            setFormData({ email, firstName, lastName, phone, role });
            setIsAdmin(role === 'admin');
          })
          .catch(err => console.error(err));
    }, [id]);

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleChange = e => {
        const newRole = e.target.checked ? 'admin' : 'user';
        setFormData({ ...formData, role: newRole });
        setIsAdmin(e.target.checked);
    };

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            // Send PUT request to update user details
            await axios.put(`http://127.0.0.1:5000/api/v1/users/${id}`, formData);
            alert('User details updated successfully');
            navigate(`/admin/users/1`);
        } catch (err) {
            console.error(err);
            alert('Error updating user details');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                        First Name
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                        Last Name
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                        Phone
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="phone"
                        name="phone"
                        type="text"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone"
                    />
                </div>
                <div className="mb-4">
                    <label className="flex items-center text-gray-700 text-sm font-bold mb-2">
                        <input
                            className="mr-2"
                            type="checkbox"
                            id="role"
                            name="role"
                            checked={isAdmin}
                            onChange={handleRoleChange}
                        />
                        Make admin user
                    </label>
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Update
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateUser;
