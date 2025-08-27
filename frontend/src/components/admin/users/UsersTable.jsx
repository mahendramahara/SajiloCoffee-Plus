import React from 'react';
import { Table, Button, Badge, Dropdown } from 'react-bootstrap';

const UsersTable = ({ users, onShowDetails, onSuspendUser, onActivateUser, hasPermission }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getSubscriptionBadge = (user) => {
    if (user.subscription && user.subscription.status === 'active') {
      return <Badge bg="success">Active</Badge>;
    } else if (user.subscription) {
      return <Badge bg="secondary">{user.subscription.status}</Badge>;
    } else {
      return <Badge bg="light">None</Badge>;
    }
  };

  return (
    <Table responsive hover className="modern-table">
      <thead>
        <tr>
          <th>User</th>
          <th>Contact</th>
          <th>Subscription</th>
          <th>Joined</th>
          <th>Last Login</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>
              <div className="d-flex align-items-center">
                <div className="user-avatar me-3">
                  <img
                    src={user.avatar || "/images/avatars/default.png"}
                    alt={user.name}
                    className="rounded-circle"
                    style={{ width: "40px", height: "40px", objectFit: "cover" }}
                  />
                </div>
                <div>
                  <h6 className="mb-1">{user.name}</h6>
                  <small className="text-muted">ID: {user.id.slice(-8)}</small>
                </div>
              </div>
            </td>
            <td>
              <div>
                <strong>{user.email}</strong>
                <br />
                <small className="text-muted">{user.phone || 'No phone'}</small>
              </div>
            </td>
            <td>{getSubscriptionBadge(user)}</td>
            <td>{formatDate(user.createdAt)}</td>
            <td>
              {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
            </td>
            <td>
              <Badge bg={user.isActive ? "success" : "secondary"}>
                {user.isActive ? "Active" : "Suspended"}
              </Badge>
            </td>
            <td>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" size="sm">
                  <i className="fas fa-ellipsis-v"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => onShowDetails(user)}>
                    <i className="fas fa-eye me-2"></i>
                    View Details
                  </Dropdown.Item>
                  {hasPermission("users", "suspend") && (
                    <>
                      <Dropdown.Divider />
                      {user.isActive ? (
                        <Dropdown.Item 
                          className="text-warning"
                          onClick={() => onSuspendUser(user.id)}
                        >
                          <i className="fas fa-pause me-2"></i>
                          Suspend User
                        </Dropdown.Item>
                      ) : (
                        <Dropdown.Item 
                          className="text-success"
                          onClick={() => onActivateUser(user.id)}
                        >
                          <i className="fas fa-play me-2"></i>
                          Activate User
                        </Dropdown.Item>
                      )}
                    </>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default UsersTable;
