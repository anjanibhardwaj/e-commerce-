import Address from '../models/Address.js';

export const getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ userId: req.user.id }).sort({ isDefault: -1, createdAt: -1 });
    return res.status(200).json({ success: true, data: addresses });
  } catch (error) {
    next(error);
  }
};

export const createAddress = async (req, res, next) => {
  try {
    const { label, fullName, phone, line1, line2, landmark, city, state, pincode, isDefault } = req.body;

    if (!fullName || !phone || !line1 || !city || !pincode) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Full name, phone, address line, city, and pincode are required.' }
      });
    }

    if (isDefault) {
      await Address.updateMany({ userId: req.user.id }, { isDefault: false });
    }

    const address = await Address.create({
      userId: req.user.id,
      label: label || 'Home',
      fullName,
      phone,
      line1,
      line2,
      landmark,
      city,
      state: state || 'Maharashtra',
      pincode,
      isDefault: !!isDefault
    });

    return res.status(201).json({ success: true, data: address });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Address.findOneAndDelete({ _id: id, userId: req.user.id });
    return res.status(200).json({ success: true, message: 'Address removed successfully.' });
  } catch (error) {
    next(error);
  }
};
