import React, { useState } from "react";
import { postMovie } from "../../services/api";

const PostMovie = () => {
    const [formData, setFormData] = useState({
        name: "",
        categories: "",
        duration: 120,
        image: null,
        video: null,
        age_limit: 13,
        description: "",
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("authToken");
            const preparedFormData = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (key === "name" || (value && value !== "")) {
                    if (key === "categories") {
                        value
                            .split(",")
                            .map((id) => id.trim())
                            .forEach((category, index) =>
                                preparedFormData.append(`categories[${index}]`, category)
                            );
                    } else {
                        preparedFormData.append(key, value);
                    }
                }
            });

            const response = await postMovie(preparedFormData, token);
            alert(`Movie posted successfully`);
        } catch (error) {
            alert(`Failed to post movie: ${JSON.stringify(error)}`);
        }
    };

    return (
        <div>
            <h3>Post Movie</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Categories (Comma Separated IDs):
                    <input
                        type="text"
                        name="categories"
                        value={formData.categories}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Duration (minutes):
                    <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Image:
                    <input
                        type="file"
                        name="image"
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Video:
                    <input
                        type="file"
                        name="video"
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Age Limit:
                    <input
                        type="number"
                        name="age_limit"
                        value={formData.age_limit}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Description:
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default PostMovie;