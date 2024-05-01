import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


const UpdateCategory = () => {
    const navigate = useNavigate();
    const { categoryId } = useParams();
    const [formData, setFormData] = useState({
        name: ''
    });

    console.log("The category id is: ", categoryId);

    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/api/v1/categories/${categoryId}`)
          .then(res => {
            const { name } = res.data;
            setFormData({ name });
          })
          .catch(err => console.error(err));
      }, [categoryId]);

    const { name } = formData;

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            // Send PUT request to update user details
            await axios.put(`http://127.0.0.1:5000/api/v1/categories/${categoryId}`, formData);
            alert('Category details updated successfully');
            navigate(`/admin/categories`)
        } catch (err) {
            console.error(err);
            alert('Error updating category details');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        CategoryName
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        name="name"
                        type="name"
                        value={name}
                        onChange={handleChange}
                        placeholder="CategoryTitle"
                    />
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

export default UpdateCategory;
