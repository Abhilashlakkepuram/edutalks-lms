import { getToken } from "../utils/auth";

const API_URL = "http://localhost:5000/api/enrollments";

export const getMyCourses = async () => {
    try {
        const token = getToken();
        console.log("Fetching courses with token:", token);
        const response = await fetch(`${API_URL}/my-courses`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        console.log("My Courses Response:", data);
        return data;
    } catch (error) {
        console.error("Error fetching my courses:", error);
        return { success: false, message: "Network error" };
    }
};
