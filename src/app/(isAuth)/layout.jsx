import Navbar from '../Components/Navbar';
export default function Layout({
    children
}){
    return (
        <>
            <div>
                <Navbar/>
            </div>
            {children}
        </>
    )
}