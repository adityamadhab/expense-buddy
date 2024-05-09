import { Outlet } from "react-router-dom";
import { DashNav } from "./DashBoard-Components/DashNav";

export function Layout() {
    return (
        <div>
            <DashNav/>
            <Outlet/>
        </div>
    )
}