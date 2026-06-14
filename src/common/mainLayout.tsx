import React from "react";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import RouterPage from "./RouterPage";

const MainLayout: React.FC = () => {
    return (
        <>
            <NavBar />

            <main style={{ display: "flex" }}>
                <SideBar />
                <RouterPage />
            </main>
        </>
    );
};

export default MainLayout;