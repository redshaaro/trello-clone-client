import { publicAxios } from "../lib/axios";

export const signup = async (username, password) => {


    try {
     const res=   await publicAxios.post("http://localhost:3000/api/auth/register", {
            username, password
        })
        return res




    }

    catch (err) {
        console.log(err)
    }



}
export const login = async (username, password) => {
    try {

     const res=   await publicAxios.post("http://localhost:3000/api/auth/login", {
            username, password
        })

        return res
    } catch (err) {
        console.log(err)
    }
}