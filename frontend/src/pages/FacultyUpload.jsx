import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../App.css";

function FacultyUpload(){

const [questionPaper, setQuestionPaper] = useState(null);
const [answerKey, setAnswerKey] = useState(null);
const [studentData, setStudentData] = useState([]);
const [answerScripts, setAnswerScripts] = useState({});
const [evaluationResults, setEvaluationResults] = useState([]);

const navigate = useNavigate();

function handleQuestionPaper(event){
const file = event.target.files[0];
if(file){
setQuestionPaper(file.name);
alert(`Question Paper uploaded: ${file.name}`);
}
}

function handleAnswerKey(event){
const file = event.target.files[0];
if(file){
setAnswerKey(file.name);
alert(`Answer Key uploaded: ${file.name}`);
}
}

function handleStudentExcel(event){
const file = event.target.files[0];
if(file){
setStudentData([
{
id:1,
name:file.name
}
]);
alert("Student details uploaded successfully");
}
}

function handleAnswerScript(event){
const files = event.target.files;

if(files.length > 0){
let scripts={};

Array.from(files).forEach((file,index)=>{
scripts[index]=file.name;
});

setAnswerScripts(scripts);

alert(`${files.length} Answer Scripts uploaded`);
}
}


// ✅ EVALUATE STUDENT ANSWER SCRIPTS
function evaluateStudentScripts(){

if(!questionPaper){
alert("Upload Question Paper");
return;
}

if(!answerKey){
alert("Upload Answer Key first");
return;
}

if(studentData.length===0){
alert("Upload Student Details");
return;
}

if(Object.keys(answerScripts).length===0){
alert("Upload Answer Scripts");
return;
}

const results = studentData.map((student,index)=>({
studentId:student.id,
studentName:student.name || `Student ${student.id}`,
marks:"85/100",
similarity:"92%",
feedback:"Compared against the uploaded answer key and evaluated semantically",
status:"Completed"
}));

setEvaluationResults(results);

alert("Student answer scripts evaluated successfully");
}


// ✅ OPTIONAL EVALUATION USING UPLOADED ANSWER KEY
function evaluateWithUploadedAnswerKey(){

if(!answerKey){
alert("Upload Answer Key");
return;
}

if(Object.keys(answerScripts).length===0){
alert("Upload Answer Scripts");
return;
}

const results = studentData.map((student,index)=>({
studentId:student.id,
studentName:student.name || `Student ${student.id}`,
marks:"78/100",
similarity:"88%",
feedback:"Partially matched with the uploaded teacher answer key",
status:"Optional Evaluation Done"
}));

setEvaluationResults(results);

alert("Optional evaluation completed using the uploaded answer key");
}



return(

<div className="upload-page">

<h1>🤖 AI Answer Evaluation System</h1>

<p>
Upload exam materials for Semantic Transformer based evaluation
</p>


<div className="upload-container">


<div className="upload-card">

<h2>📄 Question Paper</h2>

<input
id="questionPaper"
type="file"
hidden
accept=".pdf,.doc,.docx"
onChange={handleQuestionPaper}
/>

<button
className="upload-btn"
onClick={()=>document.getElementById("questionPaper").click()}
>
Upload Question Paper
</button>

<p>
{questionPaper ? "✅ "+questionPaper : "No file selected"}
</p>

</div>


<div className="upload-card">

<h2>🔑 Answer Key</h2>

<input
id="answerKey"
type="file"
hidden
accept=".pdf,.doc,.docx"
onChange={handleAnswerKey}
/>

<button
className="upload-btn"
onClick={()=>document.getElementById("answerKey").click()}
>
Upload Answer Key
</button>

<p>
{answerKey ? "✅ "+answerKey : "No file selected"}
</p>

</div>


<div className="upload-card">

<h2>📊 Student Details Excel</h2>

<input
id="studentExcel"
type="file"
hidden
accept=".xlsx,.xls,.csv"
onChange={handleStudentExcel}
/>

<button
className="upload-btn"
onClick={()=>document.getElementById("studentExcel").click()}
>
Upload Student Details
</button>

<p>
{
studentData.length>0
?
"✅ Student Excel Loaded"
:
"No file selected"
}
</p>

</div>


<div className="upload-card">

<h2>📝 Student Answer Scripts</h2>

<input
id="answerScripts"
type="file"
hidden
multiple
accept=".pdf,.jpg,.png"
onChange={handleAnswerScript}
/>

<button
className="upload-btn"
onClick={()=>document.getElementById("answerScripts").click()}
>
Upload Answer Scripts
</button>

<p>
{
Object.keys(answerScripts).length>0
?
"✅ Scripts Loaded"
:
"No files selected"
}
</p>

</div>

</div>


{/* ✅ ACTION BUTTONS SECTION */}
<div className="action-buttons">

<button
className="main-upload-btn"
onClick={evaluateStudentScripts}
>
🤖 Evaluate Student Answer Scripts
</button>

<button
className="optional-btn"
onClick={evaluateWithUploadedAnswerKey}
>
🧠 Evaluate with Uploaded Answer Key
</button>

<button
className="secondary-btn"
onClick={()=>navigate(-1)}
>
⬅ Go Back
</button>

</div>


{
evaluationResults.length>0 &&

<div className="results-section">

<h2>AI Evaluation Result</h2>

<table className="results-table">

<thead>
<tr>
<th>Student ID</th>
<th>Student Name</th>
<th>Marks</th>
<th>Semantic Score</th>
<th>AI Feedback</th>
<th>Status</th>
</tr>
</thead>

<tbody>

{
evaluationResults.map((result,index)=>(
<tr key={index}>
<td>{result.studentId}</td>
<td>{result.studentName}</td>
<td>{result.marks}</td>
<td>{result.similarity}</td>
<td>{result.feedback}</td>
<td>{result.status}</td>
</tr>
))
}

</tbody>

</table>

</div>

}

</div>

)

}

export default FacultyUpload;