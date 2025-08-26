import React from "react";
import { Form, Alert } from "react-bootstrap";

const TableSelection = ({ selectedTable, onTableChange, tables }) => {
  const availableTables = tables.filter(
    (table) => table.status === "available"
  );

  return (
    <div className="table-selection mb-4">
      <h6 className="fw-semibold mb-3">
        <i className="bi bi-geo-alt-fill text-primary me-2"></i>
        Select Your Table
      </h6>

      {availableTables.length === 0 ? (
        <Alert variant="warning" className="py-2">
          <small>No tables available at the moment</small>
        </Alert>
      ) : (
        <>
          <Form.Select
            value={selectedTable}
            onChange={(e) => onTableChange(e.target.value)}
            className="mb-2"
          >
            <option value="">Choose a table...</option>
            {availableTables.map((table) => (
              <option key={table.tableNumber} value={table.tableNumber}>
                Table {table.tableNumber} (Seats {table.capacity})
              </option>
            ))}
          </Form.Select>

          {selectedTable && (
            <div className="selected-table-info p-2 bg-light rounded">
              <small className="text-success">
                <i className="bi bi-check-circle-fill me-1"></i>
                Table {selectedTable} selected
              </small>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TableSelection;
