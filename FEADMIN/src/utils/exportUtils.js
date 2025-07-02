// src/utils/exportUtils.js
import * as XLSX from 'xlsx';
import { formatDate, formatCurrency, getInvoiceStatusInfo } from './formatting';

export const exportInvoiceToExcel = (invoice) => {
  if (!invoice) return;

  const statusInfo = getInvoiceStatusInfo(invoice.import_status);

  // --- Tạo phần thông tin chung ---
  const generalInfo = [
    ["HÓA ĐƠN NHẬP HÀNG", `Mã #${invoice.id}`],
    [], // Dòng trống
    ["Thông tin Nhà Cung Cấp", ""],
    ["Tên NCC:", invoice.supplier?.name || 'N/A'],
    ["Email:", invoice.supplier?.email || 'N/A'],
    ["SĐT:", invoice.supplier?.phonenumber || 'N/A'],
    [], // Dòng trống
    ["Thông tin Hóa Đơn", ""],
    ["Ngày nhập:", formatDate(invoice.import_date)],
    ["Trạng thái:", statusInfo.text],
  ];

  const ws1 = XLSX.utils.aoa_to_sheet(generalInfo);

  // --- Tạo phần chi tiết sản phẩm ---
  const detailsHeader = ["Sản phẩm", "Phân loại", "Số lượng", "Đơn giá", "Thành tiền"];
  const detailsData = invoice.details.map(item => [
    item.Product?.name || 'N/A',
    `${item.ColorProduct?.name || ''} / ${item.SizeProduct?.name || ''}`,
    item.quantity,
    parseFloat(item.price), // Chuyển sang số để format trong Excel
    parseFloat(item.price) * item.quantity
  ]);

  // Thêm dòng tổng cộng
  const totalAmount = invoice.details.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  detailsData.push([]); // Dòng trống
  detailsData.push(["", "", "", "Tổng cộng:", totalAmount]);

  // Ghi dữ liệu chi tiết vào sheet, bắt đầu từ sau phần thông tin chung
  XLSX.utils.sheet_add_aoa(ws1, [detailsHeader, ...detailsData], { origin: `A${generalInfo.length + 2}` });

  // --- Tùy chỉnh độ rộng cột ---
  ws1['!cols'] = [
    { wch: 25 }, // Cột A
    { wch: 30 }, // Cột B
    { wch: 15 }, // Cột C
    { wch: 20 }, // Cột D
    { wch: 20 }, // Cột E
  ];

  // --- Tạo workbook và tải về ---
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws1, "ChiTietHoaDon");

  XLSX.writeFile(wb, `HoaDonNhap_${invoice.id}.xlsx`);
};