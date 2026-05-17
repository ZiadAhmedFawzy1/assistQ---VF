import Logo from '../compnonents/Logo';
import { Auth } from '../context/Auth';
import '../styling/pages/login.css'
import { useContext, useState } from 'react';
export default function Login() {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const { API, setLoading, loading } = useContext(Auth);

    const LoginFunc = async (e) => {
        e.preventDefault();
        setLoading(true)
        if(username.trim() === "" || password.trim() === "") {
            setMessage("please enter your username and password");
            setLoading(false)
            return;
        }
        setMessage("");

        try {
            await fetch(`${API}/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }).then((res) => {
                if(res.status === 200) {
                    window.location.reload();
                    setMessage("");
                    return res.json();
                }
                setMessage("invalid inputs username/password try again");
            })
            .then(() => {
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                throw new Error("somthing wrong return to support team");
            })
        }
        catch(err) {
            console.log("Error", err);
            setMessage("somthing wrong, please try again later");
        }
    }
    return (
        <div className="login-form">
            <form onSubmit={LoginFunc}>
                <Logo size="70px" />
                <h2>welcome back</h2>
                <input type="text" placeholder="username" autoComplete='username' value={username} onChange={(e) => setUserName(e.target.value)}/>
                <input type="password" placeholder="password" autoComplete='current-password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <p>{message}</p>
                <button disabled={loading}>{loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : "Login"} </button>
            </form>
        </div>
    )
}