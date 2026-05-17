import '../styling/components/logo.css';
export default function Logo (props) {
    return (
        <div 
        style={{
            width: props.size, 
            height: props.size, 
            backgroundSize:"cover",
            margin: props.margin || "auto",
            backgroundImage: `url(${require("../resources/Logo/Vodafone.png")})`}} 
            className="VF-logo">
        </div>
    )
}