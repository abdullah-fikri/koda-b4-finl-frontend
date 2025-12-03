import { useEffect, useState } from "react"
import {AuthContext} from "./context"


export function AuthContextLayout ({children}){
    const [auth, setAuth] = useState([])

    useEffect(()=>{
        const data = JSON.parse(localStorage.getItem("user")) || []
        setAuth(data)
    },[])

    useEffect(()=>{
        localStorage.setItem("user", JSON.stringify(auth))
    },[auth])

    const contextValue = {
        auth: auth,
        setAuth: setAuth,
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}