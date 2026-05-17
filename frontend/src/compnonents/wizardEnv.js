import { useContext, useEffect, useState } from 'react';
import '../styling/components/wizardEnv.css';
import { Auth } from '../context/Auth';
import socket from './socketIo';

export default function Wizard() {
    const { API, session } = useContext(Auth);
    const [request, setRequest] = useState(null);
    const [MessageResponse, setMessageResponse] = useState("solved");
    const [rootDetails, setRootDetails] = useState(false);
    const [stemDetails, setStemDetails] = useState(false);
    const [loginTime,setLoginTime] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    })
    
    useEffect(() => {
        const interval = setInterval(() => {
            let totalMilliseconds = 0;
            const SESSION = session.data.last_login;
    
            SESSION.forEach((session, i) => {
                const loginTime = new Date(session.login);
    
                // If the session has logout, calculate from login to logout
                if (session.logout) {
                    const logoutTime = new Date(session.logout);
                    const diffMs = logoutTime - loginTime;
                    totalMilliseconds += diffMs;
                }
    
                //If the current session does not have a logout (meaning the last login)
                else if (i === SESSION.length - 1) {
                    const now = new Date();
                    const diffMs = now - loginTime;
                    totalMilliseconds += diffMs;
                }
            });
    
            const totalSeconds = Math.floor(totalMilliseconds / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            //here i will update Login time and display it..
            setLoginTime((prev) => ({
                ...prev,
                hours: hours,
                minutes: minutes,
                seconds: seconds
            }))
        }, 1000);
    
        return () => clearInterval(interval);
    }, [loginTime]);
    
    useEffect(() => {
        const GetReq = async () => {
            try {
                const res = await fetch(`${API}/getReq`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include"
                });

                if (res.status === 200) {
                    const result = await res.json();
                    setRequest(result.data);
                    // info of last req.. to prevent overload on server
                    sessionStorage.setItem("xs", JSON.stringify(result.data));
                }
            } catch (err) {
                console.error("Error fetching request:", err);
            }
        };
        /*
            prevent overload on server by save last request in local storage
            if i found xs, i will put last inputs 
        */  
        if(!sessionStorage.getItem("xs")) {
            GetReq();
        }
    }, [API]);

    // listening the accept Agent :)   
    useEffect(() => {
        const ticket = sessionStorage.getItem("xs");
        if (!ticket) return;

        const ticketId = JSON.parse(ticket);
        if (!ticketId || !ticketId._id) return;

        const eventName = `resolvedAgent-${ticketId._id}`;
        console.log("🎧 Listening to socket event:", eventName);

        const handleResolved = (data) => {
            if (data.resolved) {
                sessionStorage.removeItem("xs");
                setMessageResponse("done");
                window.location.reload();
            }
        };

        socket.on(eventName, handleResolved);

        return () => {
            socket.off(eventName, handleResolved);
        };
    }, [sessionStorage.getItem("xs")]);
    

    // if i don't have data in sessionStorage (xs) i will set it
    const savedRequest = sessionStorage.getItem("xs");
    const displayRequest = request || (savedRequest ? JSON.parse(savedRequest) : null);

    const solveProccess = async () => {
        const data = Object.keys(displayRequest);

        if(!data.includes("_id")) {
            sessionStorage.removeItem("xs");
            window.location.reload();
            return;
        }
        await fetch(`${API}/solveCase`, {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
            },
            credentials: "include",
            body: JSON.stringify({id: displayRequest._id})
        }).then((res) => {
            if(res.ok) {
                // remove and update data :)
                sessionStorage.removeItem("xs");
                window.location.reload();
            }
        })
    }

    // last update :)
    return (
        <div className="wizard flex">
            <p className='TimeLogin'>login: {`
                ${String(loginTime.hours).padStart(2,"0")}:
                ${String(loginTime.minutes).padStart(2,"0")}:
                ${String(loginTime.seconds).padStart(2,"0")}`}
            </p>
            {rootDetails && 
            <div className='details-container'>
                <div className='details-box'>
                    <div className='btn'>
                        <button onClick={() => setRootDetails(false)}>X</button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>name</th>
                                <th>reason</th>
                                <th>priority</th>
                                <th>details</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{displayRequest.name.split(" ")[0]}</td>
                                <td>{displayRequest.reason}</td>
                                <td>{displayRequest.priority}</td>
                                <td>{displayRequest.details.length <= 20 ? displayRequest.details : 
                                <button onClick={() => setStemDetails(true)} className='stem-btn-details'>details</button>
                                }</td>
                            </tr>
                        </tbody>
                    </table>
                    {stemDetails &&
                    <div>
                        <h3>reason</h3>
                        <p>{displayRequest.details}</p>
                    </div>
                    }
                </div>
            </div>
            }
            {displayRequest ? (
                <div className="request">
                    <h3>{displayRequest.name}</h3>
                    <h4>{displayRequest.reason}</h4>
                    {/* <p>{displayRequest.priority}</p> */}
                    <div className='btn-wizard'>
                        <button className={displayRequest.wizardRes ? "warning" : ""} onClick={solveProccess}>{MessageResponse}</button>
                        <button onClick={() => {
                            setRootDetails(true)
                            setStemDetails(false)
                        }} className='btnDetails'>details</button>
                    </div>
                </div>
            ) : (
                <div className='haveFun'>
                    <p><i className="fa-solid fa-pen-to-square"></i></p>
                    <p>you don't have any request</p>
                </div>
            )}
        </div>
    );
}
