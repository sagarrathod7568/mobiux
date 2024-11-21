const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "data.csv");

let data = fs
  .readFileSync(filePath, "utf-8")
  .split("\n")
  .slice(1) 
  .filter((line) => line.trim() !== "") 
  .map((line) => {
    const [date, sku, unitPrice, quantity, totalPrice] = line.split(",");
    return {
      date: date.trim(),
      month: date.slice(0, 7), 
      sku: sku.trim(),
      unitPrice: parseFloat(unitPrice),
      quantity: parseInt(quantity, 10),
      totalPrice: parseFloat(totalPrice),
    };
  });

function totalSales(salesData) {
  const totalSales = salesData.reduce((sum, item) => sum + item.totalPrice, 0);

  const monthWiseSales = {};
  salesData.forEach((item) => {
    if (!monthWiseSales[item.month]) monthWiseSales[item.month] = 0;
    monthWiseSales[item.month] += item.totalPrice;
  });

  const mostPopularItems = {};
  const itemQuantities = {};
  salesData.forEach((item) => {
    if (!itemQuantities[item.month]) itemQuantities[item.month] = {};
    if (!itemQuantities[item.month][item.sku])
      itemQuantities[item.month][item.sku] = 0;
    itemQuantities[item.month][item.sku] += item.quantity;
  });
  for (const month in itemQuantities) {
    let maxQuantity = 0;
    let popularItem = "";
    for (const sku in itemQuantities[month]) {
      if (itemQuantities[month][sku] > maxQuantity) {
        maxQuantity = itemQuantities[month][sku];
        popularItem = sku;
      }
    }
    mostPopularItems[month] = popularItem;
  }

  const topRevenueItems = {};
  const itemRevenues = {};
  salesData.forEach((item) => {
    if (!itemRevenues[item.month]) itemRevenues[item.month] = {};
    if (!itemRevenues[item.month][item.sku])
      itemRevenues[item.month][item.sku] = 0;
    itemRevenues[item.month][item.sku] += item.totalPrice;
  });
  for (const month in itemRevenues) {
    let maxRevenue = 0;
    let topItem = "";
    for (const sku in itemRevenues[month]) {
      if (itemRevenues[month][sku] > maxRevenue) {
        maxRevenue = itemRevenues[month][sku];
        topItem = sku;
      }
    }
    topRevenueItems[month] = topItem;
  }

  const ordersStats = {};
  for (const month in mostPopularItems) {
    const popularItem = mostPopularItems[month];
    const quantities = salesData
      .filter((item) => item.month === month && item.sku === popularItem)
      .map((item) => item.quantity);

    const totalOrders = quantities.length;
    const min = Math.min(...quantities);
    const max = Math.max(...quantities);
    const avg = quantities.reduce((sum, qty) => sum + qty, 0) / totalOrders;

    ordersStats[month] = { min, max, avg };
  }

  return {
    totalSales,
    monthWiseSales,
    mostPopularItems,
    topRevenueItems,
    ordersStats,
  };
}

const results = totalSales(data);
console.log(results);
