// src/data/ordersData.js
// Data orders yang terintegrasi dengan CUSTOMERS
import { CUSTOMERS } from "./customersData";
import { menuItems } from "./menuData";

const STATUS_OPTIONS = ["Selesai", "Diproses", "Menunggu", "Dibatalkan"];
const STATUS_WEIGHTS = [0.65, 0.15, 0.12, 0.08];
const PAYMENT_METHODS = ["Cash", "QRIS", "Kartu Debit", "GoPay", "OVO", "Dana", "ShopeePay"];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function weightedRandom(options, weights) {
  const r = Math.random();
  let sum = 0;
  for (let i = 0; i < options.length; i++) {
    sum += weights[i];
    if (r < sum) return options[i];
  }
  return options[options.length - 1];
}
function randomDatetime(start, end) {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Generate orders dari customer data
export const ORDERS = (() => {
  const orders = [];
  let orderId = 1;

  // Setiap customer buat beberapa order sesuai visits mereka
  CUSTOMERS.forEach((customer) => {
    // Jumlah order berkisar antara 1-5 per customer (sample dari total visits)
    const orderCount = Math.min(randInt(1, 5), customer.visits);
    
    for (let o = 0; o < orderCount; o++) {
      // Pilih 1-4 item menu secara random
      const itemCount = randInt(1, 4);
      const orderItems = [];
      const usedItems = new Set();

      for (let k = 0; k < itemCount; k++) {
        let menuItem;
        let attempts = 0;
        do {
          menuItem = randFrom(menuItems);
          attempts++;
        } while (usedItems.has(menuItem.id) && attempts < 10);
        usedItems.add(menuItem.id);

        const qty = randInt(1, 3);
        orderItems.push({
          menuId: menuItem.id,
          name: menuItem.name,
          category: menuItem.category,
          price: menuItem.price,
          qty,
          subtotal: menuItem.price * qty,
          emoji: menuItem.emoji,
        });
      }

      const total = orderItems.reduce((sum, it) => sum + it.subtotal, 0);
      const status = weightedRandom(STATUS_OPTIONS, STATUS_WEIGHTS);
      const orderDate = randomDatetime(
        new Date("2024-01-01"),
        new Date("2026-06-13")
      );

      orders.push({
        id: orderId++,
        orderId: `ORD-${String(orderId).padStart(5, "0")}`,
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        customerTier: customer.tier,
        items: orderItems,
        total,
        status,
        payment: randFrom(PAYMENT_METHODS),
        date: orderDate,
        notes: Math.random() > 0.8 ? randFrom([
          "Less sugar please",
          "Extra shot",
          "Tanpa es",
          "Suhu panas",
          "Gula 50%",
          "Extra whipped cream",
          "Oat milk",
          "No straw",
          "Takeaway",
          "Dine in",
        ]) : "",
      });
    }
  });

  // Sort by date desc
  orders.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Re-index orderId after sort
  orders.forEach((o, i) => {
    o.id = i + 1;
    o.orderId = `ORD-${String(i + 1).padStart(5, "0")}`;
  });

  return orders;
})();

export const ORDER_STATUSES = ["Semua", "Selesai", "Diproses", "Menunggu", "Dibatalkan"];
export const PAYMENT_LIST = ["Semua", "Cash", "QRIS", "Kartu Debit", "GoPay", "OVO", "Dana", "ShopeePay"];
