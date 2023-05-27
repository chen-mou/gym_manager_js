import axios from "axios";
// import {userState} from "@/state/user";

export const baseURL = process.env.NODE_ENV !== "production" ?  "http://localhost:15666" : "http://8.130.122.134/gym/api"

axios.defaults.withCredentials = true
axios.defaults.baseURL = baseURL;


export function get(path){
    return axios.get(path)
}

export function post(path, param){
    return axios.post(
        path, param, {
            "Content-Type": "application/json"
        }
    )
}

export function file(path, file){
    console.log(path, file)
}

