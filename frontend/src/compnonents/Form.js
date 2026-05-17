import { useContext } from "react"
import { Auth } from "../context/Auth"
import Agent from "./AgentEnv";
import Wizard from "./wizardEnv";
import Monitor from "./Monitor";
import RefreshPage from "./refresh";

export default function Form () {
    const { session } = useContext(Auth);
    const Role = () => {
        if(session?.data?.job === "agent") {
            return <Agent />
        }
        else if(session?.data?.job === "monitor") {
            return <Monitor />
        }
        else if(session?.data?.job === "wizard") {
            return <Wizard />;
        }
        else {
            return <RefreshPage />;
        }
    }
    return (
        <div>
            {Role()}
        </div>
    )
}