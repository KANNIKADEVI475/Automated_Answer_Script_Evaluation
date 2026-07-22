import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../App.css";

import { getUploads } from "../api/uploadApi";

function FacultyStoredScripts() {

    const navigate = useNavigate();

    const [scripts, setScripts] = useState([]);

    useEffect(() => {

        const loadScripts = async () => {

            try {

                const data = await getUploads();

                setScripts(data.answer_scripts || []);

            }

            catch (error) {

                console.error(error);

                setScripts([]);

            }

        };

        loadScripts();

    }, []);

    return (

        <div className="faculty-dashboard">

            <h1>Stored Answer Scripts</h1>

            {

                scripts.length === 0 ?

                (

                    <div>

                        <p
                            style={{
                                color: "#b91c1c",
                                fontWeight: "bold"
                            }}
                        >

                            Answer script does not exist.

                        </p>

                        <button
                            className="secondary-btn"
                            onClick={() => navigate(-1)}
                        >

                            ⬅ Back

                        </button>

                    </div>

                )

                :

                (

                    <div>

                        <ul
                            style={{
                                listStyle: "none",
                                padding: 0
                            }}
                        >

                            {

                                scripts.map((script, index) => (

                                    <li
                                        key={index}
                                        style={{
                                            background: "#fff",
                                            margin: "10px 0",
                                            padding: "12px",
                                            borderRadius: "8px",
                                            boxShadow:
                                                "0 2px 6px rgba(0,0,0,0.08)"
                                        }}
                                    >

                                        ✅ {script}

                                    </li>

                                ))

                            }

                        </ul>

                        <div style={{ marginTop: 20 }}>

                            <button
                                className="main-upload-btn"
                                onClick={() => alert("Start AI Evaluation")}
                            >

                                Start Evaluation

                            </button>

                            <button
                                className="secondary-btn"
                                style={{ marginLeft: 12 }}
                                onClick={() => navigate(-1)}
                            >

                                ⬅ Back

                            </button>

                        </div>

                    </div>

                )

            }

        </div>

    );

}

export default FacultyStoredScripts;