import { createContext, useEffect, useState } from "react";

export const Auth = createContext();

export default function Context ({children}) {
    const [API, setAPI] = useState("http://localhost:5000");
    const [loading, setLoading] = useState(false)
    const [getDataLoad, setGetDataLoad] = useState(false)
    const [session, setSession] = useState([])
    // function check from Token
    useEffect(() => {
        const fetchData = async () => {
            setGetDataLoad(true)
            try {
                const res = await fetch(`${API}/getData`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                })
                if (!res.ok) throw new Error("Failed to fetch session");
                    const result = await res.json();
                    setSession(result);
                    setGetDataLoad(false)
                }catch (error) {
                    console.error("Error fetching session:", error);
                    setSession(null);
                    setGetDataLoad(false)
            }
        }
        fetchData();
    }, [API])

    const parent = {
        API,
        setLoading,
        loading,
        session,
        getDataLoad
    }

    return <Auth.Provider value={parent}>{children}</Auth.Provider>
}