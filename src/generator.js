///@ts-check
const React = require("react");

/**
 * @param {string} label
 */
function inferLabel(label) {
    const lblParts = label
        .split(/(?=[A-Z])|(?=[0-9])/)
        .map(s => {
            return s.charAt(0).toUpperCase() + (s.length > 0 && s.slice(1));
        })
    return lblParts.join(" ");
}

/**
 * @param {string[]} targets
 * @param {string[]} markers
 */
function generateMacro(targets, markers) {
    var selectedmk = [];
    var selectedtarg = [];
    var output = [];
    var minlen = Math.min(markers.length, targets.length);
    for (var i = 0; i < minlen; i++) {
        var r = Math.floor(Math.random() * 100) % markers.length;
        while (selectedmk.indexOf(r) !== -1) {
            r = Math.floor(Math.random() * 100) % markers.length;
        }
        var m = Math.floor(Math.random() * 100) % targets.length;
        while (selectedtarg.indexOf(m) !== -1) {
            m = Math.floor(Math.random() * 100) % targets.length;
        }

        selectedmk.push(r);
        selectedtarg.push(m);
        var s = "/mk " + markers[r] + " <" + targets[m] + ">";
        output.push(s);
    }
    var ret = output.join("\n");
    return ret;
}

const STORAGE_KEY = "GENERATE_MARK_KEY_NEW";

const TARGET_MAP = {
    player1: "1",
    player2: "2",
    player3: "3",
    player4: "4",
    player5: "5",
    player6: "6",
    player7: "7",
    player8: "8",
    pet: "p",
    focusTarget: "ft",
    target: "t",
}

const CheckboxWrap = ({ checked, onChange, id, children }) => (
    <div className="input-group">
        <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e)} />
        <label htmlFor={id}>{inferLabel(children)}</label>
    </div>
);


const gen = () => {
    const [marks, setMarks] = React.useState({
        attack1: false,
        attack2: false,
        attack3: false,
        attack4: false,
        attack5: false,
        attack6: false,
        attack7: false,
        attack8: false,
        bind1: false,
        bind2: false,
        bind3: false,
        ignore1: false,
        ignore2: false,
        square: false,
        circle: false,
        cross: false,
        triangle: false,
    });

    const [targets, setTargets] = React.useState({
        player1: false,
        player2: false,
        player3: false,
        player4: false,
        player5: false,
        player6: false,
        player7: false,
        player8: false,
        pet: false,
        focusTarget: false,
        target: false,
    });

    const [output, setOutput] = React.useState('');

    const loadSelections = () => {
        if (!window.Storage)
            return;
        const savedState = window.localStorage.getItem(STORAGE_KEY);
        if (!savedState)
            return;
        const saved = JSON.parse(savedState);
        setMarks({
            ...marks,
            ...saved.marks,
        });
        setTargets({
            ...targets,
            ...saved.targets
        });
    }

    const saveSelections = () => {
        if (!window.Storage)
            return;
        const toSave = {
            marks: {},
            targets: {},
        };
        Object.keys(marks).forEach(key => marks[key] && (toSave.marks[key] = true));
        Object.keys(targets).forEach(key => targets[key] && (toSave.targets[key] = true));
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    }

    React.useEffect(() => {
        loadSelections();
    }, []);

    React.useEffect(() => {
        saveSelections();
    }, [marks, targets])

    const generate = (e) => {
        e.preventDefault();
        const markers = [];
        const $targets = [];

        Object.keys(marks).map(key => {
            marks[key] && markers.push(key);
        });
        Object.keys(targets).map(key => {
            targets[key] && $targets.push(TARGET_MAP[key]);
        });

        const gend = generateMacro($targets, markers);
        setOutput(gend);
    }
    
    const setChanged = (evt, category, key) => {
        const tmp = {};
        tmp[key] = evt.target.checked;

        if (category === "marks") {
            setMarks({ ...marks, ...tmp });
        } else if (category === "targets") {
            setTargets({ ...targets, ...tmp });
        }
    }

    const markViews = Object.keys(marks).map(key => {
        return (
            <CheckboxWrap
                key={`marks_${key}`}
                id={`marks_${key}`}
                checked={marks[key] === true}
                onChange={(e) => setChanged(e, "marks", key)}>
                {key}
            </CheckboxWrap >
        )
    });

    const targetViews = Object.keys(targets).map(key => {
        return (
            <CheckboxWrap
                key={`targets_${key}`}
                id={`targets_${key}`}
                checked={targets[key]}
                onChange={(e) => setChanged(e, "targets", key)}>
                {key}
            </CheckboxWrap>
        )
    });

    return (
        <>
            <div className="header">
                <h1>Marking Macro Generator</h1>
            </div>
            <div className="outer-group">
                <h3>Marks</h3>
                {markViews}
            </div>
            <div className="outer-group">
                <h3>Targets</h3>
                {targetViews}
            </div>
            <div className="flex-break"></div>
            <div className="button-wrap">
                <div className="input-group">
                    <button onClick={generate}>Generate</button>
                </div>
            </div>
            <div className="flex-break"></div>
            <div className="output-area">
                <textarea
                    readOnly
                    value={output}
                    cols={40}
                    rows={15}
                    style={{ marginTop: "5px" }}>
                </textarea>
            </div>
        </>
    )
}

export default gen;