import { AboutUs } from "../components/AboutUs";
import { Footer } from "../components/Footer";
import { Landing } from "../components/Landing";
import { NavBar } from "../components/NavBar";

export function IndexPage() {
    return (
        <div className="h-screen w-screen">
            <NavBar/>
            <Landing/>
            <AboutUs/>
            <Footer/>
        </div>
    )
}