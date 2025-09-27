// // TestManagement.jsx
// import React, { useState } from 'react';
// import '../styles.css/TestManagement.css';

// export default function TestManagement() {
//   const [tests, setTests] = useState([
//     { 
//       id: 1, 
//       name: 'Frontend Developer Assessment', 
//       company: 'Acme Inc.', 
//       type: 'Multiple Choice', 
//       questions: 45, 
//       duration: '60 min', 
//       status: 'Active', 
//       date: 'May 15, 2023' 
//     },
//     { 
//       id: 2, 
//       name: 'Python Backend Challenge', 
//       company: 'TechGlobal', 
//       type: 'Programming', 
//       questions: 12, 
//       duration: '90 min', 
//       status: 'Active', 
//       date: 'May 10, 2023' 
//     },
//     { 
//       id: 3, 
//       name: 'UX Design Principles', 
//       company: 'Creative Solutions', 
//       type: 'Multiple Choice', 
//       questions: 30, 
//       duration: '45 min', 
//       status: 'Draft', 
//       date: 'May 5, 2023' 
//     },
//     { 
//       id: 4, 
//       name: 'Full Stack Developer Test', 
//       company: 'Innovate Corp', 
//       type: 'Mixed', 
//       questions: 25, 
//       duration: '120 min', 
//       status: 'Active', 
//       date: 'Apr 28, 2023' 
//     },
//     { 
//       id: 5, 
//       name: 'Product Manager Assessment', 
//       company: 'SaaS Solutions', 
//       type: 'Multiple Choice', 
//       questions: 50, 
//       duration: '75 min', 
//       status: 'Archived', 
//       date: 'Apr 20, 2023' 
//     },
//     { 
//       id: 6, 
//       name: 'Data Science Challenge', 
//       company: 'Analytics Pro', 
//       type: 'Programming', 
//       questions: 15, 
//       duration: '180 min', 
//       status: 'Active', 
//       date: 'Apr 15, 2023' 
//     }
//   ]);

//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All');

//   const filteredTests = tests.filter(test => {
//     const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          test.company.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === 'All' || test.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   return (
//     <div className="test-management">
//       <div className="page-header">
//         <h1>Test Management</h1>
//         <button className="btn-primary">+ Create New Test</button>
//       </div>

//       <div className="filters">
//         <div className="search-box">
//           <input
//             type="text"
//             placeholder="Search tests..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <div className="filter-dropdown">
//           <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
//             <option value="All">All Status</option>
//             <option value="Active">Active</option>
//             <option value="Draft">Draft</option>
//             <option value="Archived">Archived</option>
//           </select>
//         </div>
//       </div>

//       <div className="tests-table">
//         <table>
//           <thead>
//             <tr>
//               <th>Test Name</th>
//               <th>Company</th>
//               <th>Test Type</th>
//               <th>Questions</th>
//               <th>Duration</th>
//               <th>Status</th>
//               <th>Date</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredTests.map(test => (
//               <tr key={test.id}>
//                 <td>{test.name}</td>
//                 <td>{test.company}</td>
//                 <td>{test.type}</td>
//                 <td>{test.questions}</td>
//                 <td>{test.duration}</td>
//                 <td>
//                   <span className={`status-badge ${test.status.toLowerCase()}`}>
//                     {test.status}
//                   </span>
//                 </td>
//                 <td>{test.date}</td>
//                 <td>
//                   <div className="action-buttons">
//                     <button className="btn-edit">Edit</button>
//                     <button className="btn-delete">Delete</button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="pagination">
//         <span>Showing 1-6 of 24 tests</span>
//         <div className="pagination-controls">
//           <button>Previous</button>
//           <button>Next</button>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from 'react'
 import '../styles.css/TestManagement.css';


const TestManagement = () => {
  return (
    <div className="test-management">
      <h1>Updating Soon....</h1>
    </div>
  )
}

export default TestManagement
