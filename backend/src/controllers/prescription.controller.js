import path from 'path';
import fs from 'fs';
import Prescription from '../models/Prescription.js';
import Order from '../models/Order.js';
import AuditLog from '../models/AuditLog.js';
import { StorageService } from '../services/storage.service.js';

export const uploadPrescription = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'FILE_MISSING', message: 'Please attach a prescription document.' }
      });
    }

    const { patientName, patientAge, doctorName, hospitalClinic } = req.body;

    const prescription = await Prescription.create({
      userId: req.user.id,
      fileKey: req.file.filename,
      mimeType: req.file.mimetype,
      fileSizeBytes: req.file.size,
      patientName: patientName || req.user.name,
      patientAge: patientAge ? Number(patientAge) : null,
      doctorName: doctorName || 'Physician',
      hospitalClinic: hospitalClinic || 'Clinic',
      status: 'PENDING_REVIEW',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30-day validity
    });

    const previewUrl = StorageService.getSignedPreviewUrl(prescription.fileKey);

    return res.status(201).json({
      success: true,
      data: {
        prescriptionId: prescription._id,
        status: prescription.status,
        validUntil: prescription.validUntil,
        previewUrl
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMyPrescriptions = async (req, res, next) => {
  try {
    const list = await Prescription.find({ userId: req.user.id }).sort({ createdAt: -1 });
    const formatted = list.map((rx) => ({
      id: rx._id,
      patientName: rx.patientName,
      doctorName: rx.doctorName,
      status: rx.status,
      validUntil: rx.validUntil,
      uploadedAt: rx.createdAt,
      previewUrl: StorageService.getSignedPreviewUrl(rx.fileKey)
    }));

    return res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};

export const previewPrescription = async (req, res, next) => {
  try {
    const { fileKey } = req.params;
    const { expires, sig } = req.query;

    if (!expires || !sig || !StorageService.verifyPreviewSignature(fileKey, expires, sig)) {
      return res.status(403).json({
        success: false,
        error: { code: 'UNAUTHORIZED_PREVIEW', message: 'Prescription preview link is invalid or expired.' }
      });
    }

    const filePath = path.resolve('uploads/prescriptions', fileKey);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Document file not found on server.' }
      });
    }

    return res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
};

export const reviewPrescription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { decision, notes } = req.body;

    if (!['APPROVED', 'REJECTED', 'NEEDS_CLARIFICATION'].includes(decision)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_DECISION', message: 'Decision must be APPROVED, REJECTED, or NEEDS_CLARIFICATION.' }
      });
    }

    const rx = await Prescription.findById(id);
    if (!rx) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Prescription not found.' } });
    }

    rx.status = decision;
    rx.reviewerId = req.user.id;
    rx.reviewNotes = notes || null;
    rx.reviewedAt = new Date();
    await rx.save();

    if (decision === 'APPROVED') {
      await Order.updateMany(
        { prescriptionIds: rx._id, status: 'AWAITING_PRESCRIPTION_REVIEW' },
        { $set: { status: 'PRESCRIPTION_APPROVED' } }
      );
    }

    await AuditLog.create({
      entityType: 'PRESCRIPTION',
      entityId: rx._id.toString(),
      action: `PRESCRIPTION_${decision}`,
      actorId: req.user.id,
      actorRole: req.user.role,
      actorEmail: req.user.email,
      details: { decision, notes }
    });

    return res.status(200).json({
      success: true,
      data: {
        prescriptionId: rx._id,
        status: rx.status,
        reviewedAt: rx.reviewedAt
      }
    });
  } catch (error) {
    next(error);
  }
};
