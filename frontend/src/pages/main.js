import { useContext } from "react"
import { Auth } from "../context/Auth"
import '../styling/pages/main.css'
import Form from "../compnonents/Form";

export default function Main () {
    const { session, getDataLoad } = useContext(Auth);
    return (
        <div>
            {!getDataLoad && session?.data &&
            <div className="main">
                <h3 className="w-h">welcome <span>{session?.data.name.split(" ")[0]}</span></h3>
                <div className="body">
                    <Form />
                </div>
            </div>
            }
        </div>
    )
}