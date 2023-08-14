const React = require("react")
const { createRoot } = require("react-dom/client")
const Generator = require("./generator").default;

createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Generator />
    </React.StrictMode>
);