import { NavBar } from "../components/NavBar";

export function UnderConstruction() {
    return (
        <div>
            <NavBar/>
            <div className="flex justify-center items-center">
                <div className="w-full max-w-7xl mx-auto xl:px-20 md:px-10 px-4">
                    <div className="my-10 py-5 text-center">
                        <h1 className="text-sm sm:text-xl font-semibold">Developer is working on this Page</h1>
                        <p className="text-sm">Have patience</p>
                    </div>
                </div>
            </div>
        </div>
    )
}