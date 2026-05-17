import { useContext } from 'react'
import '../styling/components/header.css'
import { Auth } from '../context/Auth'
export default function Header () {
    const { session, API } = useContext(Auth);
        const Logout = async () => {
            await fetch(`${API}/logout`, {
                method: "POST",
                headers: {
                    "Content-Type":"application/json",
                },
                credentials: "include"
            }).then((res) => {
                if(res.status === 200) {
                    window.location.reload();
                }
            }).catch((err) => console.log(err));
        }
    return (
        <header className="flex">
            <h1>assistQ</h1>
            <div className='btns flex'>
                <a href="/">support</a>
                {session?.data?.status && 
                    <button onClick={Logout}>Logout</button>
                }
            </div>
        </header>
    )
}