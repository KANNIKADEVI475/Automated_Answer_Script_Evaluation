import { useNavigate } from "react-router-dom";
import "./../App.css";

import {
    evaluateStudentScripts,
    evaluateWithAnswerKey
} from "../api/uploadApi";

function FacultyEvaluate() {
  const navigate = useNavigate();

  return (
    <div className="faculty-dashboard">
      <h1>AI Evaluation Options</h1>

      <div className="action-buttons evaluate-actions">
            <button
              className="main-upload-btn"
             onClick={async () => {

    try {

        const result = await evaluateStudentScripts();

        alert(result.message);

        navigate("/faculty-stored-scripts");

    }

    catch(error){

        console.log(error);

        alert("Evaluation Failed");

    }

}}
            >
              📝 Evaluate Student Answer Scripts
            </button>

            <button
              className="optional-btn"
             onClick={async ()=>{

    try{

        const result =
            await evaluateWithAnswerKey();

        alert(result.message);

        navigate("/faculty-stored-scripts");

    }

    catch(error){

        console.log(error);

        alert("Evaluation Failed");

    }

}}
            >
              🧠 Evaluate with Uploaded Answer Key
            </button>

        <button
          className="secondary-btn"
          onClick={() => navigate("/")}
        >
          ⬅ Back to Login
        </button>
      </div>
    </div>
  );
}

export default FacultyEvaluate;
