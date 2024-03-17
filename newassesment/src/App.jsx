

import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/alldatas');
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();
  
    // Table header
    const header = ['Name', 'Role', 'Status', 'Timesheet Submitted For', 'Weekly Hours', 'Overall Total Hours', 'Overall Edited Total Hours', 'Mixed Total Hours', 'Rejected By', 'Rejected Reason', 'Job No', 'Start Time', 'End Time', 'Total Hours', 'Travel Time', 'OT Hours', 'DT Hours', 'Regular Hours', 'Per Diem', 'Assigned By'];
  
    // Table data
    const tableData = data.map((record) => {
      return [
        record.emp_name,
        record.role,
        record.status,
        record.timesheet_submitted_for,
        record.weekly_hours,
        record.overall_total_hr,
        record.overall_edited_total_hr,
        record.mixed_total_hr,
        record.rejected_by,
        record.rejected_reason,
        record.Job_no[0].job_id,
        record.Job_no[0].Jobs[0].start_time,
        record.Job_no[0].Jobs[0].end_time,
        record.Job_no[0].Jobs[0].total_hours,
        record.Job_no[0].Jobs[0].travel_time,
        record.Job_no[0].Jobs[0].ot_hours,
        record.Job_no[0].Jobs[0].dt_hours,
        record.Job_no[0].Jobs[0].regular_hours,
        record.Job_no[0].Jobs[0].per_diem,
        record.Job_no[0].Jobs[0].assigned_by
      ];
    });
  
    // Codes data
    const codesHeader = ['Code', 'Seg Description', 'Segment 2 Code'];
    const codesTableData = data.flatMap((record) =>
      record.Job_no[0].Jobs[0].codes.map((code) =>
        code.segment_2_code.map((segCode) => [
          code.code,
          code.seg_description,
          segCode.code
        ])
      )
    );
  
    doc.autoTable({
      head: [header],
      body: tableData,
      styles: {
        cellPadding: 0.4,
        fontSize: 8,
        halign: 'center',
      },
      columnStyles: {
        // Customize column widths here
        // For example:
        0: { cellWidth: 10 }, // Name column width
        1: { cellWidth: 10 }, // Role column width
        2: { cellWidth: 10 }, // Status column width
        3: { cellWidth: 10 }, // Status column width
        4: { cellWidth: 10 }, // Status column width
        5: { cellWidth: 10 }, // Status column width
        6: { cellWidth: 10 }, // Status column width
        7: { cellWidth: 10 }, // Status column width
        8: { cellWidth: 10 }, // Status column width
        9: { cellWidth: 10 }, // Status column width
        // Adjust according to your needs
      }
    });
  
    doc.addPage();
  
    doc.autoTable({
      head: [codesHeader],
      body: codesTableData,
      styles: {
        cellPadding: 0.5,
        fontSize: 10,
        halign: 'center',
      },
      columnStyles: {
        // Customize column widths if needed
      }
    });
  
    doc.save('table.pdf');
  };
  
  return (
    <>
      <button className='btn btn-success float-end' onClick={downloadPDF}>Download PDF</button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Status</th>
            <th>Timesheet Submitted For</th>
            <th>Weekly Hours</th>
            <th>Overall Total Hours</th>
            <th>Overall Edited Total Hours</th>
            <th>Mixed Total Hours</th>
            <th>Rejected By</th>
            <th>Rejected Reason</th>
            <th>Job No</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Total Hours</th>
            <th>Travel Time</th>
            <th>OT Hours</th>
            <th>DT Hours</th>
            <th>Regular Hours</th>
            <th>Per Diem</th>
            <th>Assigned By</th>
          </tr>
        </thead>
        <tbody>
          {data.map((record) => (
            <React.Fragment key={record.emp_id}>
              <tr>
                <td>{record.emp_name}</td>
                <td>{record.role}</td>
                <td>{record.status}</td>
                <td>{record.timesheet_submitted_for}</td>
                <td>{record.weekly_hours}</td>
                <td>{record.overall_total_hr}</td>
                <td>{record.overall_edited_total_hr}</td>
                <td>{record.mixed_total_hr}</td>
                <td>{record.rejected_by}</td>
                <td>{record.rejected_reason}</td>
                <td>{record.Job_no[0].job_id}</td>
                <td>{record.Job_no[0].Jobs[0].start_time}</td>
                <td>{record.Job_no[0].Jobs[0].end_time}</td>
                <td>{record.Job_no[0].Jobs[0].total_hours}</td>
                <td>{record.Job_no[0].Jobs[0].travel_time}</td>
                <td>{record.Job_no[0].Jobs[0].ot_hours}</td>
                <td>{record.Job_no[0].Jobs[0].dt_hours}</td>
                <td>{record.Job_no[0].Jobs[0].regular_hours}</td>
                <td>{record.Job_no[0].Jobs[0].per_diem}</td>
                <td>{record.Job_no[0].Jobs[0].assigned_by}</td>
              </tr>
              <tr>
                <td colSpan="19">
                  <h2>Codes Data</h2>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Seg Description</th>
                        <th>Segment 2 Code</th>
                      </tr>
                    </thead>
                    <tbody>
                      {record.Job_no[0].Jobs[0].codes.map((code) => (
                        <tr key={code.code}>
                          <td>{code.code}</td>
                          <td>{code.seg_description}</td>
                          <td>
                            {code.segment_2_code.map((segCode) => (
                              <div key={segCode.code}>{segCode.code}</div>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default App;


