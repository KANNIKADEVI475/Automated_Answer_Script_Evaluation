import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./../App.css";

import { uploadFile, getUploads } from "../api/uploadApi";

function FacultyDashboard() {

    const [questionPaper, setQuestionPaper] = useState("");
    const [answerKey, setAnswerKey] = useState("");
    const [studentExcel, setStudentExcel] = useState("");
    const [answerScripts, setAnswerScripts] = useState([]);

    const navigate = useNavigate();

    // Load previously uploaded files
    useEffect(() => {

        const loadFiles = async () => {

            try {

                const files = await getUploads();

                setQuestionPaper(files.question_paper || "");
                setAnswerKey(files.answer_key || "");
                setStudentExcel(files.student_details || "");
                setAnswerScripts(files.answer_scripts || []);

            } catch (error) {

                console.error("Error loading uploaded files:", error);

            }

        };

        loadFiles();

    }, []);

    // Question Paper Upload
    const handleQuestionPaper = async (event) => {

        const file = event.target.files[0];

        if (!file) return;

        try {

            const res = await uploadFile("question-paper", file);

            setQuestionPaper(res.filename);

            alert("Question Paper Uploaded Successfully");

        } catch (error) {

            console.error(error);

            alert("Question Paper Upload Failed");

        }

    };

    // Answer Key Upload
    const handleAnswerKey = async (event) => {

        const file = event.target.files[0];

        if (!file) return;

        try {

            const res = await uploadFile("answer-key", file);

            setAnswerKey(res.filename);

            alert("Answer Key Uploaded Successfully");

        } catch (error) {

            console.error(error);

            alert("Answer Key Upload Failed");

        }

    };

    // Student Excel Upload
    const handleStudentExcel = async (event) => {

        const file = event.target.files[0];

        if (!file) return;

        try {

            const res = await uploadFile("student-details", file);

            setStudentExcel(res.filename);

            alert("Student Details Uploaded Successfully");

        } catch (error) {

            console.error(error);

            alert("Student Details Upload Failed");

        }

    };

    // Answer Scripts Upload
    const handleAnswerScripts = async (event) => {

        const files = Array.from(event.target.files);

        if (files.length === 0) return;

        try {

            const uploaded = [];

            for (const file of files) {

                const res = await uploadFile("answer-scripts", file);

                uploaded.push(res.filename);

            }

            setAnswerScripts(uploaded);

            alert(`${uploaded.length} Answer Script(s) Uploaded`);

        } catch (error) {

            console.error(error);

            alert("Answer Script Upload Failed");

        }

    };

    return (

        <div className="faculty-dashboard">

            <h1>
                👩‍🏫 Faculty Dashboard
            </h1>

            <h2>
                AI Answer Evaluation Control Panel
            </h2>

            <div className="dashboard-grid">

                {/* Question Paper */}

                <div className="dashboard-card">

                    <h3>📄 Question Paper</h3>

                    <input
                        id="dashQuestionPaper"
                        type="file"
                        hidden
                        accept=".pdf,.doc,.docx"
                        onChange={handleQuestionPaper}
                    />

                    <button
                        className="card-btn"
                        onClick={() =>
                            document
                                .getElementById("dashQuestionPaper")
                                .click()
                        }
                    >
                        Upload Question Paper
                    </button>

                    <p className="status-text">

                        {questionPaper &&
                            `✅ ${questionPaper}`}

                    </p>

                </div>

                {/* Answer Key */}

                <div className="dashboard-card">

                    <h3>🔑 Answer Key</h3>

                    <input
                        id="dashAnswerKey"
                        type="file"
                        hidden
                        accept=".pdf,.doc,.docx"
                        onChange={handleAnswerKey}
                    />

                    <button
                        className="card-btn"
                        onClick={() =>
                            document
                                .getElementById("dashAnswerKey")
                                .click()
                        }
                    >
                        Upload Answer Key
                    </button>

                    <p className="status-text">

                        {answerKey &&
                            `✅ ${answerKey}`}

                    </p>

                </div>

                {/* Student Excel */}

                <div className="dashboard-card">

                    <h3>📊 Student Details Excel</h3>

                    <input
                        id="dashStudentExcel"
                        type="file"
                        hidden
                        accept=".xlsx,.xls,.csv"
                        onChange={handleStudentExcel}
                    />

                    <button
                        className="card-btn"
                        onClick={() =>
                            document
                                .getElementById("dashStudentExcel")
                                .click()
                        }
                    >
                        Upload Student Details
                    </button>

                    <p className="status-text">

                        {studentExcel &&
                            `✅ ${studentExcel}`}

                    </p>

                </div>

                {/* Answer Scripts */}

                <div className="dashboard-card">

                    <h3>📝 Student Answer Scripts</h3>

                    <input
                        id="dashAnswerScripts"
                        type="file"
                        hidden
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={handleAnswerScripts}
                    />

                    <button
                        className="card-btn"
                        onClick={() =>
                            document
                                .getElementById("dashAnswerScripts")
                                .click()
                        }
                    >
                        Upload Answer Scripts
                    </button>

                    <div className="status-text">

                        {answerScripts.length > 0 ? (

                            answerScripts.map((script, index) => (

                                <p key={index}>
                                    ✅ {script}
                                </p>

                            ))

                        ) : (

                            ""

                        )}

                    </div>

                </div>

            </div>

            <div className="action-buttons">

                <button
                    className="main-upload-btn"
                    onClick={() =>
                        navigate("/faculty-evaluate")
                    }
                >
                    📝 Go to Evaluation Page
                </button>

                <button
                    className="secondary-btn"
                    onClick={() =>
                        navigate("/")
                    }
                >
                    ⬅ Back to Login
                </button>

            </div>

        </div>

    );

}

export default FacultyDashboard;