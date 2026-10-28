import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import OrderTrackingModal from '../../components/OrderTrackingModal';
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
  Plus,
  Home,
  Briefcase,
  Copy
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function CheckoutPage() {
  const { cart, createOrder, uploadPrescription, showToast } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Address selection & custom address state
  const defaultSavedAddress = user?.addresses?.[0] || {
    id: 'addr-default',
    tag: 'Home',
    street: 'Apt 402, Green Meadows, Link Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400058'
  };

  const [useCustomAddress, setUseCustomAddress] = useState(false);
  const [recipientName, setRecipientName] = useState(user?.name || 'Rohan Sharma');
  const [recipientPhone, setRecipientPhone] = useState(user?.phone?.replace(/\D/g, '') || '9876543210');
  const [addressLine, setAddressLine] = useState(defaultSavedAddress.street);
  const [city, setCity] = useState(defaultSavedAddress.city);
  const [state, setState] = useState(defaultSavedAddress.state);
  const [pincode, setPincode] = useState(defaultSavedAddress.pincode);
  const [addressTag, setAddressTag] = useState('Home');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'upi' | 'card'

  // Prescription step
  const hasRxItem = cart.some((item) => item.prescriptionRequired);
  const [rxFile, setRxFile] = useState(null);
  const [patientName, setPatientName] = useState(user?.name || 'Rohan Sharma');
  const [rxError, setRxError] = useState('');

  // Order submission state
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);

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

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast('Your medicine cart is empty!', 'error');
      return;
    }

    if (hasRxItem && !rxFile) {
      setRxError('A prescription is mandatory for prescription medicines (Schedule H/X). Please attach or upload a slip.');
      return;
    }

    if (!recipientName.trim() || !recipientPhone.trim() || !addressLine.trim() || !pincode.trim()) {
      showToast('Please fill all mandatory delivery address fields.', 'error');
      return;
    }

    setSubmitting(true);

    try {
      // Find primary seller for this order from first item
      const primarySellerId = cart[0]?.sellerId || null;
      const primarySellerName = cart[0]?.sellerName || 'Apollo Care Pharmacy';

      let uploadedRxId = null;
      if (rxFile) {
        const rxRecord = uploadPrescription({
          userId: user?.id || 'cust-001',
          userName: recipientName,
          patientName: patientName,
          doctorName: 'Dr. Sen, MBBS, MD',
          rxImageUrl: rxFile.url,
          fileName: rxFile.name
        });
        uploadedRxId = rxRecord?.id || null;
      }

      const shippingAddressPayload = {
        fullName: recipientName.trim(),
        phone: recipientPhone.startsWith('+91') ? recipientPhone : `+91 ${recipientPhone.trim()}`,
        street: addressLine.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        tag: addressTag
      };

      const placed = await createOrder({
        userId: user?.id || user?._id || 'cust-user',
        userName: recipientName,
        userEmail: user?.email || 'customer@example.com',
        userPhone: shippingAddressPayload.phone,
        sellerId: primarySellerId,
        sellerName: primarySellerName,
        items: cart.map((item) => ({
          id: item.id || item._id,
          productId: item.id || item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          prescriptionRequired: !!item.prescriptionRequired
        })),
        totalAmount: finalAmount,
        deliveryFee,
        shippingAddress: shippingAddressPayload,
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Prepaid (UPI / Card)',
        paymentStatus: paymentMethod === 'cod' ? 'Pending (Pay on Delivery)' : 'Paid',
        prescriptionId: uploadedRxId
      });

      setConfirmedOrder(placed);
    } catch (err) {
      showToast(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (confirmedOrder) {
    const orderRefId = confirmedOrder.orderNumber || confirmedOrder.orderId || confirmedOrder.id;

    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl mx-auto flex items-center justify-center border border-emerald-200 shadow-md animate-in zoom-in-95 duration-200">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Order Placed Successfully!
          </h1>
          <p className="text-sm text-gray-600">
            Thank you, <strong>{recipientName}</strong>. Your order has been placed and forwarded directly to the dispensing pharmacy and platform admin.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 text-left shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <div>
              <span className="text-[11px] text-gray-400 block font-bold uppercase tracking-wider">Order ID (Reference ID)</span>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="font-mono text-lg font-black text-teal-700">#{orderRefId}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(orderRefId);
                    showToast('Order ID copied to clipboard!');
                  }}
                  className="p-1 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-700 cursor-pointer"
                  title="Copy Order ID"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-gray-400 block font-bold uppercase tracking-wider">Total Payable</span>
              <span className="text-lg font-black text-gray-900">{formatCurrency(confirmedOrder.totalAmount || finalAmount)}</span>
            </div>
          </div>

          <div className="text-xs space-y-2 text-gray-600">
            <div>
              <strong className="text-gray-900">Delivery Address:</strong>{' '}
              {confirmedOrder.shippingAddress?.street}, {confirmedOrder.shippingAddress?.city} - {confirmedOrder.shippingAddress?.pincode}
            </div>
            <div>
              <strong className="text-gray-900">Contact Phone:</strong> {confirmedOrder.shippingAddress?.phone}
            </div>
            <div>
              <strong className="text-gray-900">Payment Mode:</strong> {confirmedOrder.paymentMethod}
            </div>
            <div>
              <strong className="text-gray-900">Status:</strong>{' '}
              <span className="font-bold uppercase text-teal-700">{confirmedOrder.status || 'ORDER_CONFIRMED'}</span>
            </div>
            {hasRxItem && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 font-semibold mt-2 text-xs flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Doctor prescription attached. Pharmacist verification in progress.</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setTrackingModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs rounded-xl transition shadow-md shadow-teal-700/20 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>Track Order Status Live</span>
          </button>

          <Link
            to="/account/orders"
            className="w-full sm:w-auto px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition"
          >
            View All My Orders
          </Link>
        </div>

        <OrderTrackingModal
          isOpen={trackingModalOpen}
          onClose={() => setTrackingModalOpen(false)}
          initialOrderNumber={orderRefId}
        />
      </div>
    );
  }

  // CHECKOUT FORM
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Checkout &amp; Delivery</h1>
        <p className="text-xs text-gray-500 mt-1">
          Review your items, provide verified doorstep delivery address, and place order
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (Address, Rx, Payment) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* STEP 1: DELIVERY ADDRESS */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-black text-xs">
                  1
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-gray-900">Delivery Address</h2>
                  <p className="text-[11px] text-gray-400">Order will be delivered to this location</p>
                </div>
              </div>
              <MapPin className="w-4 h-4 text-teal-700" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Rohan Sharma"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  Mobile Number (10 digits) *
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                House / Flat No, Building Name, Street &amp; Landmark *
              </label>
              <input
                type="text"
                required
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                placeholder="Apt 402, Green Meadows, Link Road, Andheri West"
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Mumbai"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Maharashtra"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="400058"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            {/* Address Tag */}
            <div className="flex items-center space-x-3 pt-1">
              <span className="text-[11px] font-bold text-gray-500 uppercase">Save as:</span>
              <button
                type="button"
                onClick={() => setAddressTag('Home')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
                  addressTag === 'Home' ? 'bg-teal-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Home className="w-3 h-3" />
                <span>Home</span>
              </button>
              <button
                type="button"
                onClick={() => setAddressTag('Work')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
                  addressTag === 'Work' ? 'bg-teal-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Briefcase className="w-3 h-3" />
                <span>Work / Office</span>
              </button>
            </div>
          </div>

          {/* STEP 2: PRESCRIPTION VERIFICATION (If required) */}
          {hasRxItem && (
            <div className="bg-white rounded-3xl border border-amber-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-amber-100">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xs">
                    2
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-gray-900">Doctor Prescription Required</h2>
                    <p className="text-[11px] text-amber-700 font-semibold">Your cart contains Schedule H medicines requiring validation</p>
                  </div>
                </div>
                <FileText className="w-4 h-4 text-amber-600" />
              </div>

              {rxFile ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Attached: <strong>{rxFile.name}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRxFile(null)}
                    className="text-rose-600 font-bold hover:underline"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-gray-600">
                    Govt. regulations mandate a valid prescription from a registered medical practitioner.
                  </p>
                  <button
                    type="button"
                    onClick={handleSimulateRxUpload}
                    className="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-amber-700" />
                    <span>⚡ Attach Doctor Prescription (Instant Verified Slip)</span>
                  </button>
                </div>
              )}

              {rxError && (
                <p className="text-xs text-rose-600 font-bold flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{rxError}</span>
                </p>
              )}
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-black text-xs">
                  {hasRxItem ? '3' : '2'}
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-gray-900">Payment Option</h2>
                  <p className="text-[11px] text-gray-400">Choose your preferred payment method</p>
                </div>
              </div>
              <CreditCard className="w-4 h-4 text-teal-700" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start space-x-3 ${
                  paymentMethod === 'cod'
                    ? 'border-teal-700 bg-teal-50/50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-0.5 text-teal-700 focus:ring-teal-700"
                />
                <div>
                  <div className="text-xs font-black text-gray-900">Cash on Delivery (COD)</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Pay in cash or UPI upon delivery at doorstep</div>
                </div>
              </label>

              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start space-x-3 ${
                  paymentMethod === 'upi'
                    ? 'border-teal-700 bg-teal-50/50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="mt-0.5 text-teal-700 focus:ring-teal-700"
                />
                <div>
                  <div className="text-xs font-black text-gray-900">UPI / Debit / Credit Card</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Instant online payment with 100% encryption</div>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4 sticky top-24">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider pb-3 border-b border-gray-100">
              Medicine Basket ({cart.length} items)
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id || item._id} className="flex justify-between items-center text-xs">
                  <div className="pr-2">
                    <div className="font-bold text-gray-900 truncate max-w-[170px]">{item.name}</div>
                    <div className="text-[10px] text-gray-400">Qty: {item.quantity} × {formatCurrency(item.price)}</div>
                  </div>
                  <div className="font-extrabold text-gray-900 shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal</span>
                <span>{formatCurrency(totalSelling)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge</span>
                <span>{deliveryFee === 0 ? <strong className="text-emerald-600 uppercase">FREE</strong> : formatCurrency(deliveryFee)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-black text-gray-900">
                <span>Total Amount to Pay</span>
                <span>{formatCurrency(finalAmount)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-black text-xs rounded-xl transition shadow-lg shadow-teal-700/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Confirm &amp; Place Order</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            <div className="text-[11px] text-center text-gray-400 flex items-center justify-center space-x-1 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
              <span>Dispensed by licensed pharmacies only</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
