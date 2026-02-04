  import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { HiX, HiCreditCard, HiCash, HiArrowCircleUp } from 'react-icons/hi';
import { FaSpinner, FaCheckCircle, FaCcVisa, FaCcMastercard } from 'react-icons/fa';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// Import bank logos
import BCALogo from '../../../assets/images/banks/bca.png';
import MandiriLogo from '../../../assets/images/banks/mandiri.png';
import BNILogo from '../../../assets/images/banks/bni.png';

const PaymentForm = ({ reservation, onSuccess, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState('transfer');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [showReceipt, setShowReceipt] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Form fields dengan validasi
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    type: '',
    isNumberValid: false,
    isNameValid: false,
    isExpiryValid: false,
    isCvvValid: false
  });

  const [transferDetails, setTransferDetails] = useState({
    bank: ''
  });

  // Data pembayaran
  const paymentMethods = {
    transfer: {
      banks: [
        { 
          name: 'BCA', 
          accountNo: '1234-5678-9012', 
          holder: 'PT HOTEL AMBA',
          logo: BCALogo,
          bgColor: 'bg-blue-50'
        },
        { 
          name: 'Mandiri', 
          accountNo: '0987-6543-2100', 
          holder: 'PT HOTEL AMBA',
          logo: MandiriLogo,
          bgColor: 'bg-yellow-50'
        },
        { 
          name: 'BNI', 
          accountNo: '0123-4567-8901', 
          holder: 'PT HOTEL AMBA',
          logo: BNILogo,
          bgColor: 'bg-orange-50'
        }
      ]
    },
    creditCard: {
      types: ['visa', 'mastercard']
    },
    cash: {
      info: 'Pembayaran cash dapat dilakukan di hotel saat check-in. Mohon simpan bukti reservasi Anda.'
    }
  };

  // Validasi real-time untuk kartu kredit
  const validateCardNumberOnChange = useCallback((number) => {
    const cleanNumber = number.replace(/\s/g, '');
    const isValid = /^[0-9]{16}$/.test(cleanNumber);
    return isValid;
  }, []);

  const validateExpiryOnChange = useCallback((expiry) => {
    if (!expiry.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) return false;
    const [month, year] = expiry.split('/');
    const expDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const today = new Date();
    return expDate > today;
  }, []);

  const formatCardNumber = useCallback((number) => {
    const cleanNumber = number.replace(/\s/g, '');
    return cleanNumber.match(/.{1,4}/g)?.join(' ') || cleanNumber;
  }, []);

  // Handler untuk input kartu kredit
  const handleCardChange = useCallback((e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    let isValid = false;

    switch (name) {
      case 'number':
        formattedValue = formatCardNumber(value);
        isValid = validateCardNumberOnChange(value);
        break;
      case 'name':
        isValid = value.length >= 3;
        break;
      case 'expiry':
        isValid = validateExpiryOnChange(value);
        break;
      case 'cvv':
        isValid = /^[0-9]{3}$/.test(value);
        break;
      default:
        break;
    }

    setCardDetails(prev => ({
      ...prev,
      [name]: formattedValue,
      [`is${name.charAt(0).toUpperCase() + name.slice(1)}Valid`]: isValid
    }));
  }, [formatCardNumber, validateCardNumberOnChange, validateExpiryOnChange]);

  // Timeout untuk session pembayaran
  useEffect(() => {
    const paymentTimeout = setTimeout(() => {
      if (paymentStatus === 'processing') {
        setError('Waktu pembayaran habis. Silakan coba lagi.');
        setPaymentStatus('idle');
        setIsProcessing(false);
      }
    }, 300000); // 5 menit timeout

    return () => clearTimeout(paymentTimeout);
  }, [paymentStatus]);

  // Kalkulasi total dengan useMemo
  const total = useMemo(() => {
    if (!reservation?.kamar?.harga_per_malam) return 0;
    const checkin = new Date(reservation.tanggal_checkin);
    const checkout = new Date(reservation.tanggal_checkout);
    const nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
    return nights * parseFloat(reservation.kamar.harga_per_malam);
  }, [reservation]);

  // Handle close dengan konfirmasi
  const handleClose = useCallback(() => {
    if (paymentStatus === 'processing') {
      const confirm = window.confirm('Pembayaran sedang diproses. Yakin ingin membatalkan?');
      if (!confirm) return;
    }
    setShowConfirmation(false); // Reset state konfirmasi
    onClose();
  }, [paymentStatus, onClose]);

  // Error handling yang lebih baik
  const handlePayment = async () => {
    try {
      setError('');
      setPaymentStatus('processing');
      setIsProcessing(true);
      setIsSubmitting(true);
      setShowConfirmation(false); // Tutup modal konfirmasi

      // Validasi berdasarkan metode pembayaran
      if (paymentMethod === 'kartu_kredit') {
        const { isNumberValid, isNameValid, isExpiryValid, isCvvValid } = cardDetails;
        if (!isNumberValid || !isNameValid || !isExpiryValid || !isCvvValid) {
          throw { code: 'INVALID_CARD' };
        }
      } else if (paymentMethod === 'transfer' && !transferDetails.bank) {
        throw { code: 'BANK_NOT_SELECTED' };
      }

      // Simulasi proses pembayaran
      await new Promise(resolve => setTimeout(resolve, 1500));

      const token = localStorage.getItem('token');
      if (!token) throw { code: 'AUTH_ERROR' };

      const paymentData = {
        reservasi_ids: [reservation.id],
        metode_pembayaran: paymentMethod === 'kartu_kredit' ? 'kartu kredit' : paymentMethod,
        status_pembayaran: paymentMethod === 'cash' ? 'pending' : 'sukses',
        jumlah: total,
        payment_details: paymentMethod === 'kartu_kredit' ? {
          card_type: cardDetails.type,
          last_four: cardDetails.number.slice(-4)
        } : {
          bank_name: transferDetails.bank
        }
      };

      const response = await axios.post(
        'http://localhost:5000/api/pembayaran',
        paymentData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setShowSuccess(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setPaymentStatus('success');
        setShowReceipt(true);
        setTimeout(() => {
          onSuccess();
        }, 1000);
      }
    } catch (err) {
      console.error('Payment error:', err);
      const errorMessage = {
        'INVALID_CARD': 'Data kartu kredit tidak valid. Mohon periksa kembali.',
        'BANK_NOT_SELECTED': 'Silakan pilih bank untuk transfer.',
        'AUTH_ERROR': 'Sesi Anda telah berakhir. Silakan login kembali.',
        'INSUFFICIENT_FUNDS': 'Dana tidak mencukupi.',
        'NETWORK_ERROR': 'Koneksi terputus. Mohon cek koneksi internet Anda.'
      }[err.code] || 'Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.';
      
      setError(errorMessage);
      setPaymentStatus('error');
      setShowConfirmation(false); // Tutup modal konfirmasi jika error
    } finally {
      setIsProcessing(false);
      setIsSubmitting(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  // Render payment receipt
  const PaymentReceipt = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white p-6 rounded-lg shadow-lg"
    >
      <div className="text-center mb-4">
        <FaCheckCircle className="text-green-500 text-4xl mx-auto" />
        <h3 className="text-xl font-semibold mt-2">Pembayaran Berhasil!</h3>
      </div>

      <div className="border-t border-b py-4 my-4">
        <div className="flex justify-between mb-2">
          <span>ID Reservasi:</span>
          <span className="font-medium">{reservation.id}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Metode Pembayaran:</span>
          <span className="font-medium">
            {paymentMethod === 'kartu_kredit'
              ? `${cardDetails.type} **** ${cardDetails.number.slice(-4)}`
              : paymentMethod === 'transfer' ? `Transfer ${transferDetails.bank}` : 'Cash'}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Total Pembayaran:</span>
          <span className="font-bold">{formatCurrency(total)}</span>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition"
      >
        Tutup
      </button>
    </motion.div>
  );

  // Komponen Konfirmasi
  const ConfirmationModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl"
      >
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Konfirmasi Pembayaran
          </h3>
          <p className="text-gray-600">
            Apakah Anda yakin ingin melakukan pembayaran ini?
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setShowConfirmation(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            disabled={isProcessing}
          >
            Batal
          </button>
          <button
            onClick={handlePayment}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Memproses...
              </>
            ) : (
              'Konfirmasi'
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Header dengan gradient */}
        <div className="bg-gradient-to-r from-[#09453D] to-[#127369] p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Pembayaran Reservasi</h2>
            <button 
              onClick={handleClose} 
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close"
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>
          {/* Total Payment Display */}
          <div className="mt-4 bg-white/10 rounded-xl p-4 backdrop-blur-md">
            <p className="text-white/80 text-sm">Total Pembayaran:</p>
            <p className="text-3xl font-bold text-white">{formatCurrency(total)}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Payment Method Selection */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <button
              type="button"
              onClick={() => setPaymentMethod('kartu_kredit')}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                paymentMethod === 'kartu_kredit'
                  ? 'border-[#09453D] bg-[#09453D]/5 shadow-md'
                  : 'border-gray-200 hover:border-[#09453D]/50'
              }`}
            >
              <HiCreditCard className={`w-8 h-8 mb-2 ${
                paymentMethod === 'kartu_kredit' ? 'text-[#09453D]' : 'text-gray-400'
              }`} />
              <span className={`text-sm font-medium ${
                paymentMethod === 'kartu_kredit' ? 'text-[#09453D]' : 'text-gray-600'
              }`}>Kartu Kredit</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('transfer')}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                paymentMethod === 'transfer'
                  ? 'border-[#09453D] bg-[#09453D]/5 shadow-md'
                  : 'border-gray-200 hover:border-[#09453D]/50'
              }`}
            >
              <HiArrowCircleUp className={`w-8 h-8 mb-2 ${
                paymentMethod === 'transfer' ? 'text-[#09453D]' : 'text-gray-400'
              }`} />
              <span className={`text-sm font-medium ${
                paymentMethod === 'transfer' ? 'text-[#09453D]' : 'text-gray-600'
              }`}>Transfer Bank</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('cash')}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                paymentMethod === 'cash'
                  ? 'border-[#09453D] bg-[#09453D]/5 shadow-md'
                  : 'border-gray-200 hover:border-[#09453D]/50'
              }`}
            >
              <HiCash className={`w-8 h-8 mb-2 ${
                paymentMethod === 'cash' ? 'text-[#09453D]' : 'text-gray-400'
              }`} />
              <span className={`text-sm font-medium ${
                paymentMethod === 'cash' ? 'text-[#09453D]' : 'text-gray-600'
              }`}>Tunai</span>
            </button>
          </div>

          {/* Payment Details Form */}
          {paymentMethod === 'kartu_kredit' && (
            <div className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Kartu
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="number"
                    value={cardDetails.number}
                    onChange={handleCardChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      cardDetails.isNumberValid 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300 focus:border-[#09453D]'
                    } focus:ring-2 focus:ring-[#09453D]/20 transition-colors`}
                    placeholder="0000 0000 0000 0000"
                    maxLength="19"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-2">
                    <FaCcVisa className="w-6 h-6 text-blue-600" />
                    <FaCcMastercard className="w-6 h-6 text-red-500" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Pemegang Kartu
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={cardDetails.name}
                    onChange={handleCardChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      cardDetails.isNameValid 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300 focus:border-[#09453D]'
                    } focus:ring-2 focus:ring-[#09453D]/20 transition-colors`}
                    placeholder="NAMA DI KARTU"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expired
                    </label>
                    <input
                      type="text"
                      name="expiry"
                      value={cardDetails.expiry}
                      onChange={handleCardChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        cardDetails.isExpiryValid 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-300 focus:border-[#09453D]'
                      } focus:ring-2 focus:ring-[#09453D]/20 transition-colors`}
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={cardDetails.cvv}
                      onChange={handleCardChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        cardDetails.isCvvValid 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-300 focus:border-[#09453D]'
                      } focus:ring-2 focus:ring-[#09453D]/20 transition-colors`}
                      placeholder="123"
                      maxLength="3"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'transfer' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {paymentMethods.transfer.banks.map((bank) => (
                <button
                  key={bank.name}
                  type="button"
                  onClick={() => setTransferDetails({ bank: bank.name })}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                    transferDetails.bank === bank.name
                      ? 'border-[#09453D] bg-[#09453D]/5 shadow-md'
                      : 'border-gray-200 hover:border-[#09453D]/50'
                  }`}
                >
                  <div className={`${bank.bgColor} p-4 rounded-lg mb-4`}>
                    <img 
                      src={bank.logo} 
                      alt={`Logo ${bank.name}`} 
                      className="h-8 object-contain mx-auto"
                    />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-800">{bank.name}</p>
                    <p className="text-sm text-gray-500 mt-1">{bank.accountNo}</p>
                    <p className="text-xs text-gray-400 mt-1">{bank.holder}</p>
                  </div>
                  {transferDetails.bank === bank.name && (
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-[#09453D] text-white p-1 rounded-full">
                        <FaCheckCircle className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {paymentMethod === 'cash' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="text-yellow-500">
                  <HiCash className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-medium text-yellow-800">Pembayaran Tunai</h3>
                  <p className="text-yellow-600 text-sm mt-1">
                    {paymentMethods.cash.info}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start space-x-3"
              >
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="mt-8 flex space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => setShowConfirmation(true)}
              disabled={isProcessing}
              className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#09453D] to-[#127369] hover:shadow-lg hover:from-[#09453D] hover:to-[#0B574E] text-white'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center space-x-2">
                  <FaSpinner className="animate-spin" />
                  <span>Memproses...</span>
                </div>
              ) : (
                'Bayar Sekarang '
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Konfirmasi Pembayaran
              </h3>
              <p className="text-gray-600 mb-6">
                Anda akan melakukan pembayaran sebesar {formatCurrency(total)}. 
                Pastikan data yang Anda masukkan sudah benar.
              </p>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={handlePayment}
                  className="flex-1 px-4 py-2 rounded-lg bg-[#09453D] text-white font-medium hover:bg-[#09453D]/90 transition-colors"
                >
                  Konfirmasi
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentForm;
