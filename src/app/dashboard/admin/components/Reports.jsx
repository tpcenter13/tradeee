'use client';

import { useState, useEffect } from 'react';
import { Search, Eye, X, AlertTriangle, Check, Printer, Download, Filter } from 'lucide-react';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [reasonFilter, setReasonFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch reports from API
const fetchReports = async () => {
  setIsLoading(true);
  setError(null);
  try {
    const params = new URLSearchParams();
    if (statusFilter !== 'All') params.append('status', statusFilter);
    const response = await fetch(`/api/getReport?${params.toString()}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch reports');
    }

    // Map API response - rely on API transformation
    const formattedReports = data.reports.map(report => ({
      id: report.id,
      reportedUser: {
        name: report.reportedUser.name,
        email: report.reportedUser.email,
        zone: report.reportedUser.zone
      },
      reportedBy: {
        name: report.reportedBy.name,
        email: report.reportedBy.email
      },
      reason: report.reason,
      date: report.date,
      status: report.status,
      message: report.message,
      priority: report.priority
    }));

    setReports(formattedReports);
  } catch (err) {
    setError(err.message);
    console.error('Error fetching reports:', err);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.reportedUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedUser.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesReason = reasonFilter === 'All' || report.reason === reasonFilter;
    const matchesPriority = priorityFilter === 'All' || report.priority === priorityFilter;
    
    return matchesSearch && matchesReason && matchesPriority;
  });

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleResolve = async (id) => {
    try {
      // Implement API call to update report status
      await fetch(`/api/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Resolved' })
      });
      setReports(reports.map(report => 
        report.id === id ? { ...report, status: 'Resolved' } : report
      ));
      setActionMessage('Report marked as resolved successfully');
      setShowModal(false);
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      setError('Failed to resolve report');
      console.error('Error resolving report:', err);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      // Implement API call to delete report
      await fetch(`/api/reports/${id}`, {
        method: 'DELETE'
      });
      setReports(reports.filter(report => report.id !== id));
      setActionMessage('User has been removed from the system');
      setShowModal(false);
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete user');
      console.error('Error deleting user:', err);
    }
  };

  const handleWarnUser = async (id) => {
    try {
      const report = reports.find(r => r.id === id);
      // Implement API call to send warning
      await fetch(`/api/getReport/${id}/warn`, {
        method: 'POST'
      });
      setActionMessage(`Warning notification sent to ${report.reportedUser.name}`);
      setShowModal(false);
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      setError('Failed to send warning');
      console.error('Error sending warning:', err);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>User Reports - ${new Date().toLocaleDateString()}</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 20px; 
              color: #333;
              line-height: 1.6;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              padding-bottom: 20px;
              border-bottom: 2px solid #e0e0e0;
            }
            .company-info {
              color: #666;
              font-size: 14px;
              margin-bottom: 10px;
            }
            .report-title { 
              font-size: 24px; 
              font-weight: bold; 
              color: #2563eb;
              margin: 10px 0;
            }
            .print-date {
              color: #666;
              font-size: 12px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            th { 
              background-color: #f8f9fa; 
              padding: 12px 8px; 
              border: 1px solid #dee2e6; 
              font-weight: 600;
              color: #495057;
              text-align: left;
            }
            td { 
              padding: 10px 8px; 
              border: 1px solid #dee2e6; 
              vertical-align: top;
            }
            tr:nth-child(even) { 
              background-color: #f8f9fa; 
            }
            .status-pending { 
              color: #f59e0b; 
              font-weight: 600;
            }
            .status-resolved { 
              color: #10b981; 
              font-weight: 600;
            }
            .priority-high { color: #dc2626; font-weight: 600; }
            .priority-medium { color: #f59e0b; font-weight: 600; }
            .priority-low { color: #10b981; font-weight: 600; }
            .user-info {
              font-size: 12px;
            }
            .user-name {
              font-weight: 600;
              margin-bottom: 2px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #666;
              font-size: 12px;
              border-top: 1px solid #e0e0e0;
              padding-top: 20px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-info">User Management System</div>
            <div class="report-title">User Reports Summary</div>
            <div class="print-date">Generated on: ${new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</div>
            <div class="print-date">Total Reports: ${filteredReports.length}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Reported User</th>
                <th>Reported By</th>
                <th>Reason</th>
                <th>Priority</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredReports.map(report => `
                <tr>
                  <td>#${report.id.toString().padStart(3, '0')}</td>
                  <td>
                    <div class="user-info">
                      <div class="user-name">${report.reportedUser.name}</div>
                      <div>${report.reportedUser.email}</div>
                      <div>${report.reportedUser.zone}</div>
                    </div>
                  </td>
                  <td>
                    <div class="user-info">
                      <div class="user-name">${report.reportedBy.name}</div>
                      <div>${report.reportedBy.email}</div>
                    </div>
                  </td>
                  <td>${report.reason}</td>
                  <td><span class="priority-${report.priority.toLowerCase()}">${report.priority}</span></td>
                  <td>${new Date(report.date).toLocaleDateString()}</td>
                  <td><span class="status-${report.status.toLowerCase()}">${report.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>This report is confidential and intended for authorized personnel only.</p>
            <p>For questions regarding this report, contact the system administrator.</p>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handlePrintIndividual = (report) => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Report #${report.id.toString().padStart(3, '0')} - ${new Date().toLocaleDateString()}</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 30px; 
              color: #333;
              line-height: 1.6;
              background: white;
            }
            .header { 
              text-align: center; 
              margin-bottom: 40px; 
              padding-bottom: 30px;
              border-bottom: 3px solid #2563eb;
            }
            .company-info {
              color: #666;
              font-size: 16px;
              margin-bottom: 15px;
              font-weight: 500;
            }
            .report-title { 
              font-size: 28px; 
              font-weight: bold; 
              color: #2563eb;
              margin: 15px 0;
            }
            .report-id {
              font-size: 20px;
              color: #374151;
              font-weight: 600;
              margin: 10px 0;
            }
            .print-date {
              color: #666;
              font-size: 14px;
              margin-top: 15px;
            }
            .content-section {
              margin: 30px 0;
              padding: 25px;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              background: #f9fafb;
            }
            .section-title {
              font-size: 18px;
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 2px solid #e5e7eb;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin: 20px 0;
            }
            .info-item {
              margin-bottom: 15px;
            }
            .info-label {
              font-weight: 600;
              color: #374151;
              font-size: 14px;
              margin-bottom: 5px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .info-value {
              color: #1f2937;
              font-size: 16px;
              padding: 8px 0;
            }
            .user-card {
              background: white;
              border: 1px solid #d1d5db;
              border-radius: 8px;
              padding: 20px;
              margin: 15px 0;
            }
            .user-card.reported {
              border-left: 4px solid #dc2626;
              background: #fef2f2;
            }
            .user-card.reporter {
              border-left: 4px solid #2563eb;
              background: #eff6ff;
            }
            .user-name {
              font-size: 18px;
              font-weight: 600;
              margin-bottom: 8px;
            }
            .user-details {
              color: #6b7280;
              font-size: 14px;
              line-height: 1.5;
            }
            .message-box {
              background: white;
              border: 1px solid #d1d5db;
              border-radius: 8px;
              padding: 20px;
              margin: 15px 0;
              font-style: italic;
              font-size: 15px;
              line-height: 1.6;
              color: #374151;
            }
            .status-badge {
              display: inline-block;
              padding: 8px 16px;
              border-radius: 20px;
              font-size: 14px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .status-pending {
              background: #fef3c7;
              color: #92400e;
              border: 1px solid #f59e0b;
            }
            .status-resolved {
              background: #d1fae5;
              color: #065f46;
              border: 1px solid #10b981;
            }
            .priority-high {
              background: #fecaca;
              color: #991b1b;
              border: 1px solid #dc2626;
            }
            .priority-medium {
              background: #fef3c7;
              color: #92400e;
              border: 1px solid #f59e0b;
            }
            .priority-low {
              background: #d1fae5;
              color: #065f46;
              border: 1px solid #10b981;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              color: #666;
              font-size: 12px;
              border-top: 2px solid #e5e7eb;
              padding-top: 30px;
            }
            .confidential {
              background: #fef2f2;
              border: 1px solid #fecaca;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
              text-align: center;
              color: #991b1b;
              font-weight: 600;
            }
            @media print {
              body { margin: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-info">User Management System</div>
            <div class="report-title">Individual Report Details</div>
            <div class="report-id">Report ID: #${report.id.toString().padStart(3, '0')}</div>
            <div class="print-date">
              Generated on: ${new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>

          <div class="content-section">
            <div class="section-title">📋 Report Summary</div>
            <div class="info-grid">
              <div>
                <div class="info-item">
                  <div class="info-label">Report Date</div>
                  <div class="info-value">${new Date(report.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Report Reason</div>
                  <div class="info-value">${report.reason}</div>
                </div>
              </div>
              <div>
                <div class="info-item">
                  <div class="info-label">Priority Level</div>
                  <div class="info-value">
                    <span class="status-badge priority-${report.priority.toLowerCase()}">${report.priority} Priority</span>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-label">Current Status</div>
                  <div class="info-value">
                    <span class="status-badge status-${report.status.toLowerCase()}">${report.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-title">👥 Involved Parties</div>
            
            <div class="user-card reported">
              <div style="color: #dc2626; font-weight: 600; font-size: 14px; margin-bottom: 10px;">🚨 REPORTED USER</div>
              <div class="user-name">${report.reportedUser.name}</div>
              <div class="user-details">
                <div>📧 Email: ${report.reportedUser.email}</div>
                <div>📍 Zone: ${report.reportedUser.zone}</div>
              </div>
            </div>

            <div class="user-card reporter">
              <div style="color: #2563eb; font-weight: 600; font-size: 14px; margin-bottom: 10px;">👤 REPORTER</div>
              <div class="user-name">${report.reportedBy.name}</div>
              <div class="user-details">
                <div>📧 Email: ${report.reportedBy.email}</div>
              </div>
            </div>
          </div>

          <div class="content-section">
            <div class="section-title">📝 Report Message</div>
            <div class="message-box">
              "${report.message}"
            </div>
          </div>

          <div class="confidential">
            ⚠️ CONFIDENTIAL DOCUMENT - For Authorized Personnel Only
          </div>
          
          <div class="footer">
            <p><strong>User Management System</strong></p>
            <p>This report contains sensitive information and should be handled according to company privacy policies.</p>
            <p>For questions regarding this report, contact the system administrator.</p>
            <p style="margin-top: 20px; font-size: 10px; color: #999;">
              Document ID: RPT-${report.id}-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}
            </p>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-red-600 bg-red-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Reports Management</h1>
              <p className="text-gray-600">Monitor and manage user-submitted reports from messages and listings.</p>
              <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
                <span>Total Reports: <strong className="text-gray-900">{reports.length}</strong></span>
                <span>Pending: <strong className="text-yellow-600">{reports.filter(r => r.status === 'Pending').length}</strong></span>
                <span>Resolved: <strong className="text-green-600">{reports.filter(r => r.status === 'Resolved').length}</strong></span>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handlePrint}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                disabled={isLoading}
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Report
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 shadow-sm">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
        
        {actionMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 flex items-center">
            <Check className="w-5 h-5 mr-2" />
            {actionMessage}
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
        
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user name or email..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select 
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={reasonFilter}
                onChange={(e) => setReasonFilter(e.target.value)}
              >
                <option value="All">All Reasons</option>
                <option value="Scam/Fraud">Scam/Fraud</option>
                <option value="No Response">No Response</option>
                <option value="Item Not as Described">Item Not as Described</option>
                <option value="Rude Behavior">Rude Behavior</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <select 
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
            
            <select 
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
        
        {/* Reports Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Reported User</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Reported By</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Reason</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Priority</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <div className="text-lg font-medium">Loading reports...</div>
                      </div>
                    </td>
                  </tr>
                ) : filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-700">
                              {report.reportedUser.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                           
                            <div className="text-sm text-gray-500">{report.reportedUser.email}</div>
                            <div className="text-xs text-gray-400">{report.reportedUser.zone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {report.reportedBy.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{report.reportedBy.name}</div>
                            <div className="text-sm text-gray-500">{report.reportedBy.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{report.reason}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(report.priority)}`}>
                          {report.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(report.date)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          report.status === 'Pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            onClick={() => handleViewReport(report)}
                          >
                            <Eye className="w-4 h-4 mr-1" /> View
                          </button>
                          <button 
                            className="inline-flex items-center px-3 py-1 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            onClick={() => handlePrintIndividual(report)}
                          >
                            <Printer className="w-4 h-4 mr-1" /> Print
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-12 h-12 text-gray-300" />
                        <div className="text-lg font-medium">No reports found</div>
                        <div className="text-sm">Try adjusting your search criteria</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Report Detail Modal */}
        {showModal && selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Report Details</h2>
                <button 
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setShowModal(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">Report ID</div>
                      <div className="text-lg font-semibold text-gray-900">#{selectedReport.id.toString().padStart(3, '0')}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">Date Reported</div>
                      <div className="text-gray-900">{formatDate(selectedReport.date)}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">Priority Level</div>
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(selectedReport.priority)}`}>
                        {selectedReport.priority} Priority
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">Report Reason</div>
                      <div className="text-gray-900 font-medium">{selectedReport.reason}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">Current Status</div>
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                        selectedReport.status === 'Pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {selectedReport.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-red-800 mb-3">👤 Reported User</div>
                      <div className="space-y-2">
                        
                        <div><span className="font-medium">Email:</span> {selectedReport.reportedUser.email}</div>
                     
                      </div>
                    </div>
                    
                   
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <div className="text-sm font-medium text-gray-500 mb-3">📝 Report Message</div>
                  <div className="bg-gray-50 rounded-lg p-4 text-gray-900 leading-relaxed">
                    {selectedReport.message}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 p-6 bg-gray-50 rounded-b-xl">
                <button 
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  onClick={() => handlePrintIndividual(selectedReport)}
                >
                  <Printer className="w-4 h-4 mr-2" /> Print Report
                </button>
                <button 
                  className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  onClick={() => handleWarnUser(selectedReport.id)}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" /> Issue Warning
                </button>
                <button 
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  onClick={() => handleDeleteUser(selectedReport.id)}
                >
                  <X className="w-4 h-4 mr-2" /> Delete User
                </button>
                <button 
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  onClick={() => handleResolve(selectedReport.id)}
                >
                  <Check className="w-4 h-4 mr-2" /> Mark as Resolved
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;