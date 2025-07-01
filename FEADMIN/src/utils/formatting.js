export const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Intl.DateTimeFormat('vi-VN', options).format(new Date(dateString));
  } catch (e) {
    console.error("Error formatting date:", dateString, e);
    return 'Invalid Date';
  }
};

export const formatCurrency = (amount, currency = 'VND') => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '-';
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount));
};

export const getOrderStatusInfo = (statusValue, statusesArray = []) => {
  const statusObj = statusesArray.find(s => s.modelValue === String(statusValue));
  if (!statusObj) {
    return { text: `Không rõ (${statusValue})`, apiKey: '', className: 'bg-gray-200 text-gray-700' };
  }

  let className = 'bg-gray-200 text-gray-700'; // Default
  switch (statusObj.apiKey?.toLowerCase()) {
    case 'pending':
      className = 'bg-yellow-200 text-yellow-800';
      break;
    case 'processing': // Or confirmed
      className = 'bg-blue-200 text-blue-800';
      break;
    case 'shipped': // Or completed
      className = 'bg-green-200 text-green-800';
      break;
    case 'delivered': // Assuming this might exist
       className = 'bg-teal-200 text-teal-800';
       break;
    case 'cancelled':
      className = 'bg-red-200 text-red-800';
      break;
    case 'failed':
      className = 'bg-pink-200 text-pink-800';
      break;
    default:
      // Use description if apiKey is not specific enough
      if (statusObj.description?.toLowerCase().includes('pending')) className = 'bg-yellow-200 text-yellow-800';
      else if (statusObj.description?.toLowerCase().includes('process') || statusObj.description?.toLowerCase().includes('confirm')) className = 'bg-blue-200 text-blue-800';
      else if (statusObj.description?.toLowerCase().includes('ship') || statusObj.description?.toLowerCase().includes('complete')) className = 'bg-green-200 text-green-800';
      else if (statusObj.description?.toLowerCase().includes('cancel')) className = 'bg-red-200 text-red-800';
      break;
  }
  return {
    text: statusObj.description || `Trạng thái ${statusValue}`,
    apiKey: statusObj.apiKey,
    className: `${className} px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap`
  };
};


// src/utils/formatting.js



export const getInvoiceStatusInfo = (status) => {
  const baseClass = "px-2 py-1 text-xs font-semibold leading-tight rounded-full";
  switch (String(status)) {
    case '0':
      return { text: 'Nháp', className: `${baseClass} text-yellow-700 bg-yellow-100` };
    case '1':
      return { text: 'Đã gửi', className: `${baseClass} text-blue-700 bg-blue-100` };
    case '2':
      return { text: 'Hoàn thành', className: `${baseClass} text-green-700 bg-green-100` };
    default:
      return { text: 'Không rõ', className: `${baseClass} text-gray-700 bg-gray-100` };
  }
};