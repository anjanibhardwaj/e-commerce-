import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, ShieldCheck, Camera, Check } from 'lucide-react';

export default function PrescriptionModal({ isOpen, onClose, onUploadSuccess }) {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [patientName, setPatientName] = useState('');
  const [doctorName, setDoctorName] = useState('');

  if (!isOpen) return null;

  const handleSimulateUpload = (sampleName) => {
    setFileName(sampleName || "Dr_Sharma_Prescription_Cardiology.pdf");
    setPatientName("Rohan Sharma");
    setDoctorName("Dr. Alok Verma, MD");
    setFileUploaded(true);
  };

  const handleConfirmOrder = () => {
    onUploadSuccess({
      fileName,
      patientName: patientName || "Patient",
      doctorName: doctorName || "Authorized Doctor",
      timestamp: new Date().toLocaleTimeString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-teal-800 text-white">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-teal-100">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">Order with Prescription</h3>
              <p className="text-[11px] text-teal-200">Verified by PharmEasy registered pharmacists</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/80 hover:text-white p-1 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {!fileUploaded ? (
            <>
              {/* Drag & drop box */}
              <div 
                onClick={() => handleSimulateUpload("Prescription_Sample_Scan.jpg")}
                className="border-2 border-dashed border-teal-400 bg-teal-50/50 hover:bg-teal-50 rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center group"
              >
                <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold text-gray-800 mb-1">
                  Click to Upload or Drag and Drop
                </h4>
                <p className="text-xs text-gray-500 mb-3">
                  Upload JPG, PNG or PDF (Max 10MB)
                </p>
                <div className="flex items-center space-x-2 text-[11px] font-semibold text-teal-800 bg-white px-3 py-1.5 rounded-full border border-teal-200">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Use Sample Prescription (1-Click)</span>
                </div>
              </div>

              {/* Guide tips */}
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-xs text-gray-600 space-y-1">
                <div className="font-bold text-gray-700 flex items-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1" />
                  Valid Prescription Guidelines:
                </div>
                <p>• Must include Doctor's name &amp; Registration number</p>
                <p>• Must clearly state Patient name &amp; Date</p>
                <p>• Medicine dosage &amp; duration must be readable</p>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center space-x-3 text-emerald-900">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold uppercase text-emerald-800">Prescription Attached</div>
                  <div className="text-sm font-semibold truncate text-emerald-950">{fileName}</div>
                  <div className="text-[11px] text-emerald-700">Digital validation passed</div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Patient Full Name
                  </label>
                  <input 
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600"
                    placeholder="Enter Patient's Name"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Doctor / Hospital Name
                  </label>
                  <input 
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600"
                    placeholder="Enter Doctor or Clinic name"
                  />
                </div>
              </div>

              <button 
                onClick={handleConfirmOrder}
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 px-4 rounded-xl text-sm transition shadow-sm cursor-pointer"
              >
                Submit Prescription &amp; Order
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
