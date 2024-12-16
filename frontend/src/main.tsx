import { createRoot } from "react-dom/client";
import { Dapp } from "./components/Dapp";
import "./index.css";

// This is the entry point of your application, but it just renders the Dapp
// react component. All of the logic is contained in it.
createRoot(document.getElementById("root")!).render(
    <Dapp />
);