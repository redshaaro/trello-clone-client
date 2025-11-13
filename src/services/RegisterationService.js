import { publicAxios } from "../lib/axios";

export const signup = async (username, email, password) => {
    try {
        const res = await publicAxios.post("http://localhost:3000/api/auth/register", {
            username,
            email,
            password
        })
        return res
    } catch (err) {
        console.error("Signup error:", err)
        throw err
    }
}
export const login = async (username, password) => {
    try {
     const res = await publicAxios.post("http://localhost:3000/api/auth/login", {
            username, password
        })

        return res
    } catch (err) {
        console.error(err)
        throw err
    }
}