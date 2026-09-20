import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function DataImportExport({ data, tableName, onImportSuccess, filename = 'export' }) {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const handleExportExcel = () => {
        if (!data || data.length === 0) {
            toast.error("No data to export");
            return;
        }
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, `${filename}.xlsx`);
    };

    const handleExportPDF = () => {
        if (!data || data.length === 0) {
            toast.error("No data to export");
            return;
        }
        const doc = new jsPDF('landscape');
        const headers = Object.keys(data[0]);
        const rows = data.map(obj => headers.map(h => obj[h] !== null && obj[h] !== undefined ? String(obj[h]) : ''));
        
        doc.autoTable({
            head: [headers],
            body: rows,
            styles: { fontSize: 8 },
            theme: 'grid'
        });
        doc.save(`${filename}.pdf`);
    };

    const handleImportClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const bstr = evt.target.result;
                const workbook = XLSX.read(bstr, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet);
                
                if (jsonData.length === 0) {
                    toast.error("The uploaded Excel file is empty");
                    setUploading(false);
                    return;
                }

                // Call bulk import API
                const res = await axios.post('/api/core/bulk-import', {
                    table_name: tableName,
                    rows: jsonData
                }, { withCredentials: true });

                toast.success(`Successfully imported ${res.data.inserted} rows!`);
                if (onImportSuccess) onImportSuccess();
            } catch (err) {
                console.error(err);
                toast.error(err.response?.data?.error || "Failed to process or upload Excel file");
            } finally {
                setUploading(false);
                if (fileInputRef.current) fileInputRef.current.value = null;
            }
        };
        reader.readAsBinaryString(file);
    };

    return (
        <div style={{ display: 'inline-flex', gap: '8px', marginLeft: '10px' }}>
            <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept=".xlsx, .xls, .csv" 
                onChange={handleFileChange} 
            />
            
            <button 
                type="button"
                className="btn btn-sm btn-light shadow-sm"
                onClick={handleImportClick}
                disabled={uploading || !tableName}
                title="Import from Excel"
                style={{ border: '1px solid #e2e8f0', color: '#475569', borderRadius: '4px', fontWeight: 500 }}
            >
                {uploading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-file-import text-success mr-1"></i> Import</>}
            </button>
            
            <button 
                type="button"
                className="btn btn-sm btn-light shadow-sm"
                onClick={handleExportExcel}
                title="Export to Excel"
                style={{ border: '1px solid #e2e8f0', color: '#475569', borderRadius: '4px', fontWeight: 500 }}
            >
                <i className="fas fa-file-excel text-success mr-1"></i> Excel
            </button>
            
            <button 
                type="button"
                className="btn btn-sm btn-light shadow-sm"
                onClick={handleExportPDF}
                title="Export to PDF"
                style={{ border: '1px solid #e2e8f0', color: '#475569', borderRadius: '4px', fontWeight: 500 }}
            >
                <i className="fas fa-file-pdf text-danger mr-1"></i> PDF
            </button>
        </div>
    );
}
