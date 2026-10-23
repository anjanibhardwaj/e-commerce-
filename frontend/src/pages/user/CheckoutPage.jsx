import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  CheckCircle2, 
  MapPin, 
  FileText, 
  CreditCard, 
  ShieldCheck, 
  Upload, 
  ArrowRight,
  AlertCircle,
  Truck,
  Check
} from 'lucide-react';
import { formatCurrency, generateOrderId } from '../../utils/formatters';

export default function CheckoutPage() {
  const { cart, createOrder, uploadPrescription, showToast } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Address selection
  const userAddresses = user?.addresses || [
    {
      id: 'addr-1',
      tag: 'Home',
      street: 'Apt 402, Green Meadows, Andheri West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400058',
      isDefault: true
    }
  ];

  const [selectedAddressId, setSelectedAddressId] = useState(userAddresses[0]?.id || 'addr-1');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'upi' | 'card'

  // Prescription step
  const hasRxItem = cart.some((item) => item.prescriptionRequired);
  const [rxFile, setRxFile] = useState(null);
  const [patientName, setPatientName] = useState(user?.name || 'Rohan Sharma');
  const [rxError, setRxError] = useState('');

  // Order placed state
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const totalSelling = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = totalSelling > 499 || totalSelling === 0 ? 0 : 49;
  const finalAmount = totalSelling + deliveryFee;

  const handleSimulateRxUpload = () => {
    setRxFile({
      name: 'dr_prescription_signed.jpg',
      url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80'
    });
    setRxError('');
    showToast('Prescription attached successfully!');
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast('Your cart is empty!', 'error');
      return;
    }

    if (hasRxItem && !rxFile) {
      setRxError('A prescription is mandatory for prescription medicines. Please upload or attach a prescription.');
      return;
    }

    const chosenAddress = userAddresses.find((a) => a.id === selectedAddressId) || userAddresses[0];

    // Find primary seller for this order from first item
    const primarySellerId = cart[0]?.sellerId || 'seller-001';
    const primarySellerName = cart[0]?.sellerName || 'Apollo Care Pharmacy';

    let uploadedRxId = null;
    if (rxFile) {
      const rxRecord = uploadPrescription({
        userId: user?.id || 'user-001',
        userName: user?.name || 'Guest User',
        patientName: patientName,
        doctorName: 'Dr. Sen, MBBS, MD',
        rxImageUrl: rxFile.url,
        fileName: rxFile.name
      });
      uploadedRxId = rxRecord.id;
    }

    const newOrder = createOrder({
      userId: user?.id || 'user-001',
      userName: user?.name || 'Customer',
      userEmail: user?.email || 'customer@example.com',
      userPhone: user?.phone || '+91 9876543210',
      sellerId: primarySellerId,
      sellerName: primarySellerName,
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        prescriptionRequired: !!item.prescriptionRequired
      })),
      totalAmount: finalAmount,
      deliveryFee,
      shippingAddress: {
        name: user?.name || 'Customer',
        tag: chosenAddress.tag,
        street: chosenAddress.street,
        city: chosenAddress.city,
        state: chosenAddress.state,
        pincode: chosenAddress.pincode
      },
      paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Prepaid (UPI / Card)',
      paymentStatus: paymentMethod === 'cod' ? 'Pending (Pay on Delivery)' : 'Paid',
      prescriptionId: uploadedRxId
    });

    setConfirmedOrder(newOrder);
  };

  if (confirmedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl mx-auto flex items-center justify-center border border-emerald-200 shadow-md">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Order Placed Successfully!
          </h1>
          <p className="text-sm text-gray-600">
            Thank you, <strong>{user?.name || 'Customer'}</strong>. Your order has been registered and assigned to our certified partner pharmacy.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 text-left shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100 text-xs">
            <div>
              <span className="text-gray-400 block font-semibold">Order Reference:</span>
              <span className="font-mono text-base font-extrabold text-teal-700">#{confirmedOrder.id}</span>
            </div>
            <div className="text-right">
              <span className="text-gray-400 block font-semibold">Total Paid:</span>
              <span className="text-base font-extrabold text-gray-900">{formatCurrency(confirmedOrder.totalAmount)}</span>
            </div>
          </div>

          <div className="text-xs space-y-1.5 text-gray-600">
            <div><strong>Fulfillment Partner:</strong> {confirmedOrder.sellerName}</div>
            <div><strong>Delivery Address:</strong> {confirmedOrder.shippingAddress.street}, {confirmedOrder.shippingAddress.city} - {confirmedOrder.shippingAddress.pincode}</div>
            <div><strong>Payment Method:</strong> {confirmedOrder.paymentMethod}</div>
            {hasRxItem && (
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 font-semibold mt-2">
                Prescription attached. Our licensed pharmacist is reviewing your doctor's slip before dispatch.
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/account/orders"
            className="w-full sm:w-auto px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs rounded-xl transition shadow-md"
          >
            Track Order Status Live &rarr;
          </Link>

          <Link
            to="/products"
            className="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Checkout &amp; Confirmation</h1>
        <p className="text-xs text-gray-500 mt-0.5">Complete delivery address and payment verification</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Steps Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Delivery Address */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-teal-700" />
              1. Delivery Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {userAddresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition relative ${
                    selectedAddressId === addr.id
                      ? 'border-teal-700 bg-teal-50/50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-teal-800 uppercase">{addr.tag}</span>
                    {selectedAddressId === addr.id && (
                      <Check className="w-4 h-4 text-teal-700" />
                    )}
                  </div>
                  <p className="text-xs text-gray-700 leading-snug">{addr.street}</p>
                  <p className="text-xs text-gray-500 mt-1">{addr.city}, {addr.pincode}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Prescription Upload (If Rx Required) */}
          {hasRxItem && (
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center">
                <FileText className="w-4 h-4 mr-2 text-rose-600" />
                2. Mandatory Doctor Prescription (Rx)
              </h2>

              <p className="text-xs text-gray-600 leading-relaxed">
                As per Indian Pharmacy Council guidelines, Schedule H medicines require valid doctor verification.
              </p>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Patient Full Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full max-w-sm px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              {rxFile ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={rxFile.url} alt="Rx" className="w-12 h-12 object-cover rounded-lg border border-emerald-300" />
                    <div>
                      <div className="text-xs font-extrabold text-emerald-900">{rxFile.name}</div>
                      <div className="text-[10px] text-emerald-700">Valid Rx slip attached ✓</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setRxFile(null)}
                    className="text-xs text-rose-600 font-bold hover:underline"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="p-6 border-2 border-dashed border-gray-300 rounded-2xl text-center space-y-2 bg-slate-50">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                  <div className="text-xs font-bold text-gray-700">Attach doctor prescription document</div>
                  <p className="text-[10px] text-gray-500">Supports JPG, PNG, PDF up to 5MB</p>
                  <div>
                    <button
                      type="button"
                      onClick={handleSimulateRxUpload}
                      className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer shadow-xs"
                    >
                      Attach Sample Doctor Prescription
                    </button>
                  </div>
                </div>
              )}

              {rxError && <p className="text-xs text-rose-600 font-bold">{rxError}</p>}
            </div>
          )}

          {/* Step 3: Payment Method */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center">
              <CreditCard className="w-4 h-4 mr-2 text-teal-700" />
              3. Payment Selection
            </h2>

            <div className="space-y-2.5">
              {[
                { id: 'cod', title: 'Cash on Delivery (COD)', desc: 'Pay with cash or UPI QR upon receiving medicine package' },
                { id: 'upi', title: 'Instant UPI / QR Code', desc: 'Google Pay, PhonePe, Paytm, or BHIM' },
                { id: 'card', title: 'Credit / Debit Card', desc: 'Visa, MasterCard, RuPay (Demo 3DS secure)' }
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`p-3.5 rounded-2xl border-2 flex items-start space-x-3 cursor-pointer transition ${
                    paymentMethod === opt.id
                      ? 'border-teal-700 bg-teal-50/40'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === opt.id}
                    onChange={() => setPaymentMethod(opt.id)}
                    className="mt-1 text-teal-600 focus:ring-teal-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-gray-900">{opt.title}</div>
                    <div className="text-[11px] text-gray-500">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider pb-2 border-b border-gray-100">
              Review Items ({cart.length})
            </h3>

            <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="py-2.5 flex justify-between text-xs">
                  <div className="truncate max-w-[180px]">
                    <div className="font-semibold text-gray-800 truncate">{item.name}</div>
                    <div className="text-[10px] text-gray-400">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal</span>
                <span>{formatCurrency(totalSelling)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charges</span>
                <span>{deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : formatCurrency(deliveryFee)}</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between text-base font-black text-gray-900">
                <span>Total Amount</span>
                <span>{formatCurrency(finalAmount)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full py-4 bg-teal-700 hover:bg-teal-800 text-white font-black text-sm rounded-xl transition shadow-lg shadow-teal-700/20 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Confirm &amp; Place Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
