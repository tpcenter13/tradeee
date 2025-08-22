'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

const ReportsPage = () => {
  const [reports, setReports] = useState([
    {
      id: 1,
      reportedUser: { name: 'Ela', email: 'ela@example.com', zone: 'Zone 1' },
      reportedBy: { name: 'Ana', email: 'ana@example.com' },
      reason: 'Scam/Fraud',
      date: '2025-08-18',
      status: 'Pending',
      message: 'User asked for payment but never delivered the item.'
    },
    {
      id: 2,
      reportedUser: { name: 'Carlo', email: 'carlo@example.com', zone: 'Zone 3' },
      reportedBy: { name: 'Jen', email: 'jen@example.com' },
      reason: 'Rude Behavior',
      date: '2025-08-18',
      status: 'Resolved',
      message: 'User was very aggressive in messages.'
    },
    {
      id: 3,
      reportedUser: { name: 'Leo', email: 'leo@example.com', zone: 'Zone 5' },
      reportedBy: { name: 'Mark', email: 'mark@example.com' },
      reason: 'No Response',
      date: '2025-08-18',
      status: 'Pending',
      message: 'User has not responded to messages for over a week.'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.reportedUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedUser.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || report.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleAction = async (action, reportId) => {
    // In a real app, you would make an API call here
    const updatedReports = reports.map(report => {
      if (report.id === reportId) {
        if (action === 'warn') {
          setActionMessage(`Warning sent to ${report.reportedUser.name}`);
        } else if (action === 'delete') {
          setActionMessage(`User ${report.reportedUser.name} has been deleted`);
          return { ...report, status: 'Resolved' };
        } else if (action === 'resolve') {
          setActionMessage(`Report marked as resolved`);
          return { ...report, status: 'Resolved' };
        }
      }
      return report;
    });

    if (action === 'delete' || action === 'resolve') {
      setReports(updatedReports);
    }
    
    // Hide the message after 3 seconds
    setTimeout(() => setActionMessage(''), 3000);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className={styles.container}>
      <h1>Reports</h1>
      <p className={styles.subtitle}>All user-submitted reports from messages or listings.</p>
      
      {actionMessage && (
        <div className={styles.actionMessage}>
          {actionMessage}
        </div>
      )}
      
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by User / Email"
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select 
          className={styles.filterSelect}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>
      
      <div className={styles.tableContainer}>
        <table className={styles.reportsTable}>
          <thead>
            <tr>
              <th>Reported</th>
              <th>Reported By</th>
              <th>Reason</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <div className={styles.userCell}>
                      <div className={styles.avatar}>{report.reportedUser.name.charAt(0)}</div>
                      <div>
                        <div className={styles.userName}>{report.reportedUser.name}</div>
                        <div className={styles.userEmail}>{report.reportedUser.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.userCell}>
                      <div className={`${styles.avatar} ${styles.reporter}`}>
                        {report.reportedBy.name.charAt(0)}
                      </div>
                      <div>
                        <div className={styles.userName}>{report.reportedBy.name}</div>
                        <div className={styles.userEmail}>{report.reportedBy.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{report.reason}</td>
                  <td>{formatDate(report.date)}</td>
                  <td>
                    <span className={`${styles.status} ${styles[report.status.toLowerCase()]}`}>
                      {report.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={styles.viewButton}
                      onClick={() => handleViewReport(report)}
                    >
                      👁 View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className={styles.noResults}>
                  No reports found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedReport && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Report Details</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>
            
            <div className={styles.modalContent}>
              <div className={styles.detailSection}>
                <div className={styles.detailLabel}>📅 Date:</div>
                <div className={styles.detailValue}>{formatDate(selectedReport.date)}</div>
              </div>
              
              <div className={styles.detailSection}>
                <div className={styles.detailLabel}>🧍 Reported User:</div>
                <div className={styles.detailValue}>
                  <div>Name: {selectedReport.reportedUser.name}</div>
                  <div>Email: {selectedReport.reportedUser.email}</div>
                  <div>Zone: {selectedReport.reportedUser.zone}</div>
                </div>
              </div>
              
              <div className={styles.detailSection}>
                <div className={styles.detailLabel}>🧑 Reported By:</div>
                <div className={styles.detailValue}>
                  <div>Name: {selectedReport.reportedBy.name}</div>
                  <div>Email: {selectedReport.reportedBy.email}</div>
                </div>
              </div>
              
              <div className={styles.detailSection}>
                <div className={styles.detailLabel}>📌 Reason:</div>
                <div className={styles.detailValue}>{selectedReport.reason}</div>
              </div>
              
              <div className={styles.detailSection}>
                <div className={styles.detailLabel}>📝 Message:</div>
                <div className={`${styles.detailValue} ${styles.messageBox}`}>
                  {selectedReport.message}
                </div>
              </div>
            </div>
            
            <div className={styles.modalActions}>
              <button 
                className={`${styles.actionButton} ${styles.warnButton}`}
                onClick={() => handleAction('warn', selectedReport.id)}
              >
                ⚠️ Issue Warning
              </button>
              <button 
                className={`${styles.actionButton} ${styles.deleteButton}`}
                onClick={() => handleAction('delete', selectedReport.id)}
              >
                ❌ Delete User
              </button>
              <button 
                className={`${styles.actionButton} ${styles.resolveButton}`}
                onClick={() => handleAction('resolve', selectedReport.id)}
              >
                ✅ Mark as Resolved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
