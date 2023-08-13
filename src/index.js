const React = require("react")
const ReactDOM = require("react-dom");
const Generator = require("./generator").default;

ReactDOM.render(
    <React.StrictMode>
        <Generator />
    </React.StrictMode>,
    document.getElementById("root"));