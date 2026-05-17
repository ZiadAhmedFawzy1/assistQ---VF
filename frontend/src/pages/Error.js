import Logo from "../compnonents/Logo";
import '../styling/pages/error.css'

export default function Error () {
    return (
        <div className="error flex">
            <div className="container flex">
                <Logo margin="10px" size="100px" />
                <div className="content">
                    <h2>Oops - 404</h2>
                    <p>we couldn't find the page you were looking for</p>
                    <a href='/'>go to main page</a>
                </div>
            </div>
        </div>
    )
}