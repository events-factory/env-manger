// dummyData.js
const ClientList = require('../models/clientList');

async function insertDummyData() {
  try {
    const clients = await ClientList.findAll();
    if (clients.length > 0) {
      console.log('Dummy data already inserted.');
      return;
    }

    await ClientList.bulkCreate([
      // Dummy client data
      { names: 'John Doe', settlement_account: '123456789', createdAt: new Date(), updatedAt: new Date() },
      { names: 'Jane Smith', settlement_account: '987654321', createdAt: new Date(), updatedAt: new Date() },
      // Add more dummy data here
    ]);

    console.log('Dummy data inserted successfully.');
  } catch (error) {
    console.error('Unable to insert dummy data:', error);
  }
}

module.exports = insertDummyData;
