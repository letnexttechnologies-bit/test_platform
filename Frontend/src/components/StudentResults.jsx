// // StudentResults.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../styles.css/StudentResults.css';

// export default function StudentResults() {
//   const navigate = useNavigate();
//   const [filters, setFilters] = useState({
//     testName: 'All Tests',
//     dateFrom: '',
//     dateTo: '',
//     scoreMin: '',
//     scoreMax: '',
//     status: 'All Status'
//   });

//   const [results, setResults] = useState([
//     {
//       id: 1,
//       student: { initials: 'JD', name: 'John Doe' },
//       test: 'Java Programming',
//       score: 85,
//       status: 'Pass',
//       completionTime: '45 min',
//       submissionDate: '2023-07-15'
//     },
//     {
//       id: 2,
//       student: { initials: 'AS', name: 'Alice Smith' },
//       test: 'Python Basics',
//       score: 92,
//       status: 'Pass',
//       completionTime: '38 min',
//       submissionDate: '2023-07-14'
//     },
//     {
//       id: 3,
//       student: { initials: 'RJ', name: 'Robert Johnson' },
//       test: 'SQL Fundamentals',
//       score: 58,
//       status: 'Fail',
//       completionTime: '52 min',
//       submissionDate: '2023-07-13'
//     },
//     {
//       id: 4,
//       student: { initials: 'EW', name: 'Emily Wilson' },
//       test: 'React Development',
//       score: 78,
//       status: 'Pass',
//       completionTime: '65 min',
//       submissionDate: '2023-07-12'
//     },
//     {
//       id: 5,
//       student: { initials: 'MB', name: 'Michael Brown' },
//       test: 'Java Programming',
//       score: 64,
//       status: 'Fail',
//       completionTime: '48 min',
//       submissionDate: '2023-07-11'
//     },
//     {
//       id: 6,
//       student: { initials: 'SL', name: 'Sarah Lee' },
//       test: 'Python Basics',
//       score: 89,
//       status: 'Pass',
//       completionTime: '42 min',
//       submissionDate: '2023-07-10'
//     }
//   ]);

//   const handleViewPerformance = (studentId) => {
//     navigate(`/admin/student-performance/${studentId}`);
//   };

//   return (
//     <div className="student-results">
//       <div className="page-header">
//         <h1>Test Results</h1>
//       </div>

//       <div className="filters">
//         <div className="filter-group">
//           <label>Test Name</label>
//           <select
//             value={filters.testName}
//             onChange={(e) => setFilters({ ...filters, testName: e.target.value })}
//           >
//             <option>All Tests</option>
//             <option>Java Programming</option>
//             <option>Python Basics</option>
//             <option>SQL Fundamentals</option>
//             <option>React Development</option>
//           </select>
//         </div>

//         <div className="filter-group">
//           <label>Date Range</label>
//           <div className="date-range">
//             <input
//               type="date"
//               value={filters.dateFrom}
//               onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
//               placeholder="mm/dd/yyyy"
//             />
//             <span>to</span>
//             <input
//               type="date"
//               value={filters.dateTo}
//               onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
//               placeholder="mm/dd/yyyy"
//             />
//           </div>
//         </div>

//         <div className="filter-group">
//           <label>Score Range</label>
//           <div className="score-range">
//             <input
//               type="number"
//               min="0"
//               max="100"
//               value={filters.scoreMin}
//               onChange={(e) => setFilters({ ...filters, scoreMin: e.target.value })}
//               placeholder="Min"
//             />
//             <span>to</span>
//             <input
//               type="number"
//               min="0"
//               max="100"
//               value={filters.scoreMax}
//               onChange={(e) => setFilters({ ...filters, scoreMax: e.target.value })}
//               placeholder="Max"
//             />
//           </div>
//         </div>

//         <div className="filter-group">
//           <label>Status</label>
//           <select
//             value={filters.status}
//             onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//           >
//             <option>All Status</option>
//             <option>Pass</option>
//             <option>Fail</option>
//           </select>
//         </div>
//       </div>

//       <div className="results-table">
//         <table>
//           <thead>
//             <tr>
//               <th>Student</th>
//               <th>Test Name</th>
//               <th>Score</th>
//               <th>Status</th>
//               <th>Completion Time</th>
//               <th>Submission Date</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {results.map(result => (
//               <tr key={result.id}>
//                 <td>
//                   <div className="student-info">
//                     <span className="student-avatar">{result.student.initials}</span>
//                     <span>{result.student.name}</span>
//                   </div>
//                 </td>
//                 <td>{result.test}</td>
//                 <td>{result.score} ({result.score}%)</td>
//                 <td>
//                   <span className={`status-badge ${result.status.toLowerCase()}`}>
//                     {result.status}
//                   </span>
//                 </td>
//                 <td>{result.completionTime}</td>
//                 <td>{result.submissionDate}</td>
//                 <td>
//                   <div className="action-buttons">
//                     <button 
//                       className="btn-view"
//                       onClick={() => handleViewPerformance(result.id)}
//                     >
//                       View Performance
//                     </button>
//                     <button className="btn-export">Export</button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="pagination">
//         <span>Showing 1 to 6 of 24 entries</span>
//         <div className="pagination-controls">
//           <button>Previous</button>
//           <button>Next</button>
//         </div>
//       </div>
//     </div>
//   );
// }


import React from 'react'
import '../styles.css/StudentResults.css';


const StudentResults = () => {
  return (
    <div  className="student-results" >
      <h1>Updating Soon....</h1>
    </div>
  )
}

export default StudentResults



