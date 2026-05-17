import { useContext, useEffect, useState } from "react"
import { Auth } from "../context/Auth"
import '../styling/components/agentEnv.css'
import Data from '../data/reasons.json';
import socket from './socketIo';

export default function Agent() {
    const { session, API } = useContext(Auth);
    const [reason, setReason] = useState("");
    const [priority, setPriority] = useState(3);
    const [message, setMessage] = useState("")
    const [response, setResponse] = useState(false);
    const [statusShakHand, setStatusShakHand] = useState(false)
    const [resonseDone, setResponseDone] = useState(false);
    const [details, setDetails] = useState("")

        const Request = (e) => {
        e.preventDefault();
        // this is all valid reasons only in array []
        const allowedReasons = Data.map(item => item.label); 
        // filter valid value and return reasons
        // using && bec, priority is higher than || - if found RAR_S is 1 not care about 2 other conditions
        if (!allowedReasons.includes(reason) || reason === "reason") {
            setMessage("Please select a valid reason from the list");
            return;
        }
        // prevent overload requests 
        if(sessionStorage.getItem("RAR_S") === "1") {
            setMessage("Wait a little while, someone will come to you now");
            return;
        }
        // make details less than 50 characters
        if(details.length > 50) {
            setMessage("Your details are too long; please write a brief reason.");
            return;
        }
        setMessage("")
        fetch(`${API}/request`, {
                method: "POST",
                headers: {
                    "Content-Type":"application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    name: session?.data?.name,
                    reason: reason,
                    details: details,
                    priority: Number(priority)
            })
        }).then((res) => {
            // request send please waiting the wizard :)
            if(res.status === 200) {
                sessionStorage.setItem("RAR_S", 1);
                setResponse(true);
                return res.json();
            }
        }).then((result) => {
            // TKt stand for => tacketId (save in sessionStorage)
            sessionStorage.setItem("TKt", result.response);
            // must make reload here to make socket io react with u
            window.location.reload();
        })
    };

    /*
        when Wizard accept the solve the problem agent makes handshake 
        to accept the solve and close the request (successfully) 
    */
    useEffect(() => {
        const ticketId = sessionStorage.getItem("TKt");
        if (!ticketId) return;
    
        const eventName = `resolved-${ticketId}`;
    
        const handleResolved = (data) => {
            if (data.resolved) {
                // i will write action which takes here
                setStatusShakHand(true)
            }
        };
    
        socket.on(eventName, handleResolved);
    
        return () => {
            socket.off(eventName, handleResolved);
        };
    }, []);

    const shakeMark = (e) => {
        e.preventDefault();
        fetch(`${API}/shakeMark`, {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
            },
            credentials: "include",
            body: JSON.stringify({id: sessionStorage.getItem("TKt")})
        }).then((res) => {
            if(res.status === 200) {
                setResponseDone(true)
                sessionStorage.removeItem("TKt");
                sessionStorage.removeItem("RAR_S");
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }
        })
    }
        return (
        <div className="agent flex">
            <form>
                <h3>Agent</h3>
                <input type="text" value={session?.data?.name} disabled />
                <select onChange={(e) => {setReason(e.target.value); setDetails("")}}>
                    {Data.map((e, i) =>
                        <option value={i !== 0 ? e.label : ""} disabled={i === 0} selected={i === 0} key={i}>{e.label}</option>
                    )}
                </select>
                {reason !== "other reason" ? 
                <select onChange={(e) => setDetails(e.target.value)} disabled={reason === ""}>
                    <option selected={details === ""} value={""}>details reason</option>
                {Data.filter((e) => e.label === reason)
                    .flatMap((item) => item.details)
                    .map((detail, i) => (
                    <option value={detail} key={i}>{detail}</option>
                    ))
                }
                </select>
                :
                <textarea onChange={(e) => setDetails(e.target.value)} value={details} maxLength={50} type="text" placeholder="write your reason"></textarea>
                }
                <select onChange={(e) => setPriority(e.target.value)}>
                    <option disabled selected>priority</option>
                    <option value={1}>high</option>
                    <option value={2}>normal</option>
                    <option value={3}>low</option>
                </select>
                <p className="message">{message}</p>
                <div className="btn">
                    {!statusShakHand ? 
                    <button type="button" onClick={Request}
                    className={response || sessionStorage.getItem("RAR_S") ? "warning" : ""} 
                    disabled={response || sessionStorage.getItem("RAR_S")}>
                    {response || sessionStorage.getItem("RAR_S") ? "waiting the wizard" : "get wizard"}</button>
                    :
                    <button className="btnShackHand" onClick={shakeMark} type="button">{!resonseDone ? "shake hand" : "done"}</button>
                    }
                </div>
            </form>
        </div>
    )
}