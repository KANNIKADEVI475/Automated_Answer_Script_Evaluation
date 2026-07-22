import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../App.css";


function FacultyDashboard(){

	const [questionPaper, setQuestionPaper] = useState(null);
	const [answerKey, setAnswerKey] = useState(null);
	const [studentExcel, setStudentExcel] = useState(null);
	const [answerScripts, setAnswerScripts] = useState([]);

	const navigate = useNavigate();

	function handleQuestionPaper(event){
		const file = event.target.files && event.target.files[0];
		if(file){
			setQuestionPaper(file.name);
			alert(`Question Paper selected: ${file.name}`);
			try{ localStorage.setItem('questionPaper', file.name); }catch(e){}
		}
	}

	function handleAnswerKey(event){
		const file = event.target.files && event.target.files[0];
		if(file){
			setAnswerKey(file.name);
			alert(`Answer Key selected: ${file.name}`);
			try{ localStorage.setItem('answerKey', file.name); }catch(e){}
		}
	}

	function handleStudentExcel(event){
		const file = event.target.files && event.target.files[0];
		if(file){
			setStudentExcel(file.name);
			alert(`Student details selected: ${file.name}`);
			try{ localStorage.setItem('studentExcel', file.name); }catch(e){}
		}
	}

	function handleAnswerScripts(event){
		const files = event.target.files;
		if(files && files.length>0){
			const names = Array.from(files).map(f=>f.name);
			setAnswerScripts(names);
			alert(`${files.length} answer script(s) selected`);
			try{ localStorage.setItem('answerScripts', JSON.stringify(names)); }catch(e){}
		}
	}

	return(

		<div className="faculty-dashboard">

			<h1>
				👩‍🏫 Faculty Dashboard
			</h1>

			<h2>
				AI Answer Evaluation Control Panel
			</h2>

			<div className="dashboard-grid">

				<div className="dashboard-card">
					<h3>📄 Question Paper</h3>
					<input id="dashQuestionPaper" type="file" hidden accept=".pdf,.doc,.docx" onChange={handleQuestionPaper} />
					<button className="card-btn" onClick={()=>document.getElementById('dashQuestionPaper').click()}>Upload Question Paper</button>
					<p className="status-text">{questionPaper? `✅ ${questionPaper}` : ''}</p>
				</div>

				<div className="dashboard-card">
					<h3>🔑 Answer Key</h3>
					<input id="dashAnswerKey" type="file" hidden accept=".pdf,.doc,.docx" onChange={handleAnswerKey} />
					<button className="card-btn" onClick={()=>document.getElementById('dashAnswerKey').click()}>Upload Answer Key</button>
					<p className="status-text">{answerKey? `✅ ${answerKey}` : ''}</p>
				</div>

				<div className="dashboard-card">
					<h3>📊 Student Details Excel</h3>
					<input id="dashStudentExcel" type="file" hidden accept=".xlsx,.xls,.csv" onChange={handleStudentExcel} />
					<button className="card-btn" onClick={()=>document.getElementById('dashStudentExcel').click()}>Upload Student Details</button>
					<p className="status-text">{studentExcel? `✅ ${studentExcel}` : ''}</p>
				</div>

				<div className="dashboard-card">
					<h3>📝 Student Answer Scripts</h3>
					<input id="dashAnswerScripts" type="file" hidden multiple accept=".pdf,.jpg,.png" onChange={handleAnswerScripts} />
					<button className="card-btn" onClick={()=>document.getElementById('dashAnswerScripts').click()}>Upload Answer Scripts</button>
					<p className="status-text">{answerScripts.length>0? `✅ ${answerScripts.length} file(s)` : ''}</p>
				</div>

			</div>

			<div className="action-buttons">
				<button className="main-upload-btn" onClick={() => navigate("/faculty-evaluate")}>📝 Go to Evaluation Page</button>
				<button className="secondary-btn" onClick={() => navigate("/")}>⬅ Back to Login</button>
			</div>

		</div>

	)

}


export default FacultyDashboard;