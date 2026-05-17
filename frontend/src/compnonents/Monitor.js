import { useContext, useEffect, useState } from 'react'
import '../styling/components/monitor.css'
import { Auth } from '../context/Auth'
import Data from '../data/reasons.json';
export default function Monitor () {

    const { API } = useContext(Auth);
    const [data, setData] = useState([]);
    const [Case,setCase] = useState("");
    const [Agent,setAgent] = useState("");
    const [Wizard,serWizard] = useState("");
    const [solution, setSolution] = useState({
        success: 0,
        pending: 0,
        topWizard: "",
        nosyAgent: "",
        TopCaseRepeated: "",
    });
    useEffect(() => {
        const ShowAll = async () => {
            await fetch(`${API}/Requests`, {
                method: "GET",
                headers: {
                    "Content-Type":"application/json",
                },
                credentials: "include"
            }).then((res) => {
                if(!res.ok) {
                    throw new Error("somthing wrong please return to technical support team")
                };
                return res.json();
            }).then((result) => {
                setData(result.requests);
            }).catch((error) => {
                
            })
        }
        ShowAll();
    }, [API])

    useEffect(() => {
        // most Repeated person (Agent, Wizard)
        function mostRepeatedByKey(arr, key) {
            const counts = {};
        
            arr.forEach(obj => {
                const value = obj[key];
                counts[value] = (counts[value] || 0) + 1;
            });
        
            let maxCount = 0;
            let mostRepeatedValue = null;
        
            for (let k in counts) {
                if (counts[k] > maxCount) {
                    maxCount = counts[k];
                    mostRepeatedValue = k;
                }
            }
            return { value: mostRepeatedValue, count: maxCount };
        }
        
        setSolution(prev => ({
            ...prev,
            success: data.filter(e => e.wizardRes && e.agentRes).length,
            pending: data.filter(e => !e.wizardRes || !e.agentRes).length,
            topWizard: mostRepeatedByKey(data, "wizard"),
            nosyAgent: mostRepeatedByKey(data, "name"),
            TopCaseRepeated: mostRepeatedByKey(data, "reason")
        }));
    }, [data]);
    console.log(solution);
    return (
        <div className="monitor">
            <h2>control panel</h2>
            <div className="box">
                <input type='text' placeholder='agent name' value={Agent} onChange={(e) => setAgent(e.target.value)} />
                <input type='text' placeholder='wizard name' value={Wizard} onChange={(e) => serWizard(e.target.value)} />
                <select onChange={(e) => setCase(e.target.value)} >
                    {Data.map((e, i) => 
                        <option value={i !== 0 ? e.label : ""} key={i}>{e.label}</option>
                    )}
                </select>
                {data.length === 0 ? 
                <p style={{textAlign: "center"}}>loading...</p>
                :
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>name</th>
                            <th>reason</th>
                            <th>priority</th>
                            <th>wizard</th>
                            <th>status</th>
                        </tr>
                    </thead>
                    <tbody>
                    {data
                        .filter((e) =>
                            e.name.toLowerCase().includes(Agent.toLowerCase()) &&
                            e.wizard.toLowerCase().includes(Wizard.toLowerCase()) &&
                            e.reason.toLowerCase().includes(Case.toLowerCase())
                        )
                        .map((e, i) => {
                            const priorityMap = {
                            1: "high",
                            2: "normal",
                            3: "low"
                            };

                            return (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{e.name}</td>
                                <td>{e.reason}</td>
                                <td className={priorityMap[e.priority]}>{priorityMap[e.priority] || e.priority}</td>
                                <td>{e.wizard || "-"}</td>
                                <td className={e.wizardRes && e.agentRes ? "success" : ""}>{e.wizardRes && e.agentRes ? "success" : "pending"}</td>
                            </tr>
                            );
                        })}
                    </tbody>
                </table>
                }
            </div>
            <div className='solution flex'>
                <p>pending: {solution.pending}</p>
                <p>success: {solution.success}</p>
                <p>Most frequent case: {solution.TopCaseRepeated.value}</p>
                <p>Nosy: {solution.nosyAgent.value}</p>
                <p>top wizard: {solution.topWizard.value}</p>
            </div>
        </div>
    )
}