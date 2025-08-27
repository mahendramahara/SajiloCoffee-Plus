import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';

const OrdersTable = ({ orders, onShowDetails, onUpdateStatus, onDeleteOrder, hasPermission }) => {
  const getStatusBadge = (status) => {
    const variants = {
      pending: "secondary",
      preparing: "warning",
      served: "success",
      cancelled: "danger",
    };
    return variants[status] || "primary";
  };

  const getStatusActions = (order) => {
    const actions = [];

    if (order.status === "pending") {
      actions.push(
        <Button
          key="prepare"
          size="sm"
          variant="warning"
          onClick={() => onUpdateStatus(order.id, "preparing")}
          className="me-1"
        >
          Start Preparing
        </Button>
      );
    }

    if (order.status === "preparing") {
      actions.push(
        <Button
          key="serve"
          size="sm"
          variant="success"
          onClick={() => onUpdateStatus(order.id, "served")}
          className="me-1"
        >
          Mark Served
        </Button>
      );
    }

    if (order.status !== "cancelled" && order.status !== "served") {
      actions.push(
        <Button
          key="cancel"
          size="sm"
          variant="danger"
          onClick={() => onUpdateStatus(order.id, "cancelled")}
        >
          Cancel
        </Button>
      );
    }

    return actions;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Table responsive hover>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Table</th>
          <th>Items</th>
          <th>Total</th>
          <th>Status</th>
          <th>Placed At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>
              <span className="order-id">#{order.id.slice(-8)}</span>
              {order.subscriptionPerkApplied && (
                <div>
                  <Badge bg="warning" size="sm">
                    <i className="fas fa-crown me-1"></i>
                    Perk Applied
                  </Badge>
                </div>
              )}
            </td>
            <td>
              <div>
                <strong>{order.user?.name || "Unknown"}</strong>
                <br />
                <small className="text-muted">{order.user?.email}</small>
              </div>
            </td>
            <td>
              <span className="table-number">Table {order.table}</span>
            </td>
            <td>
              <div>
                <strong>
                  {order.items.length} item{order.items.length > 1 ? "s" : ""}
                </strong>
                <br />
                <small className="text-muted">
                  {order.items
                    .slice(0, 2)
                    .map((item) => item.product?.name)
                    .join(", ")}
                  {order.items.length > 2 && "..."}
                </small>
              </div>
            </td>
            <td>
              <div>
                <strong className="order-total">₨{order.total}</strong>
                {order.discount > 0 && (
                  <div>
                    <small className="text-success">
                      -₨{order.discount} discount
                    </small>
                  </div>
                )}
              </div>
            </td>
            <td>
              <Badge bg={getStatusBadge(order.status)}>
                {order.status}
              </Badge>
            </td>
            <td>
              <small>{formatTime(order.placedAt)}</small>
            </td>
            <td>
              <div className="d-flex flex-wrap gap-1">
                <Button
                  variant="outline-info"
                  size="sm"
                  onClick={() => onShowDetails(order)}
                >
                  <i className="fas fa-eye"></i>
                </Button>

                {hasPermission("orders", "update") && getStatusActions(order)}

                {hasPermission("orders", "delete") && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onDeleteOrder(order.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default OrdersTable;
