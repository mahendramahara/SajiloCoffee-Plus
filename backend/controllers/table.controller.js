import { Table } from '../models/table.model.js';
import Order from '../models/order.model.js';
import { success, error, notFound, validation } from '../utils/apiResponse.js';

export const getTables = async (req, res) => {
  try {
    const { status } = req.query;
    
    const filter = {};
    if (status) filter.status = status;

    const tables = await Table.find(filter)
      .populate('currentOrderId')
      .sort({ tableNumber: 1 });

    return success(res, tables, 'Tables retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to get tables', 500);
  }
};

export const getTableById = async (req, res) => {
  try {
    const { tableId } = req.params;

    const table = await Table.findById(tableId).populate('currentOrderId');
    if (!table) {
      return notFound(res, 'Table not found');
    }

    return success(res, table, 'Table retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to get table', 500);
  }
};

export const getTableByNumber = async (req, res) => {
  try {
    const { tableNumber } = req.params;

    const table = await Table.findOne({ tableNumber: parseInt(tableNumber) })
      .populate('currentOrderId');
      
    if (!table) {
      return notFound(res, 'Table not found');
    }

    return success(res, table, 'Table retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to get table', 500);
  }
};

export const createTable = async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body;

    const existingTable = await Table.findOne({ tableNumber });
    if (existingTable) {
      return validation(res, 'Table number already exists');
    }

    const table = new Table({
      tableNumber,
      capacity,
      status: 'available'
    });

    await table.save();
    return success(res, table, 'Table created successfully', 201);
  } catch (err) {
    return error(res, 'Failed to create table', 500);
  }
};

export const updateTable = async (req, res) => {
  try {
    const { tableId } = req.params;
    const { tableNumber, capacity, status } = req.body;

    const table = await Table.findById(tableId);
    if (!table) {
      return notFound(res, 'Table not found');
    }

    if (tableNumber && tableNumber !== table.tableNumber) {
      const existingTable = await Table.findOne({ tableNumber });
      if (existingTable) {
        return validation(res, 'Table number already exists');
      }
      table.tableNumber = tableNumber;
    }

    if (capacity !== undefined) table.capacity = capacity;
    if (status) {
      const validStatuses = ['available', 'occupied', 'reserved'];
      if (!validStatuses.includes(status)) {
        return validation(res, 'Invalid table status');
      }
      table.status = status;
    }

    await table.save();
    return success(res, table, 'Table updated successfully');
  } catch (err) {
    return error(res, 'Failed to update table', 500);
  }
};

export const deleteTable = async (req, res) => {
  try {
    const { tableId } = req.params;

    const table = await Table.findById(tableId);
    if (!table) {
      return notFound(res, 'Table not found');
    }

    if (table.status === 'occupied') {
      return validation(res, 'Cannot delete occupied table');
    }

    await Table.findByIdAndDelete(tableId);
    return success(res, null, 'Table deleted successfully');
  } catch (err) {
    return error(res, 'Failed to delete table', 500);
  }
};

export const reserveTable = async (req, res) => {
  try {
    const { tableNumber } = req.params;

    const table = await Table.findOne({ tableNumber: parseInt(tableNumber) });
    if (!table) {
      return notFound(res, 'Table not found');
    }

    if (table.status !== 'available') {
      return validation(res, 'Table is not available for reservation');
    }

    table.status = 'reserved';
    await table.save();

    return success(res, table, 'Table reserved successfully');
  } catch (err) {
    return error(res, 'Failed to reserve table', 500);
  }
};

export const releaseTable = async (req, res) => {
  try {
    const { tableNumber } = req.params;

    const table = await Table.findOne({ tableNumber: parseInt(tableNumber) });
    if (!table) {
      return notFound(res, 'Table not found');
    }

    table.status = 'available';
    table.currentOrderId = null;
    await table.save();

    return success(res, table, 'Table released successfully');
  } catch (err) {
    return error(res, 'Failed to release table', 500);
  }
};
