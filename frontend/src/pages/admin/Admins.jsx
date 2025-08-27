import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Modal,
  Form,
  Dropdown,
  InputGroup,
} from "react-bootstrap";
import { useAdminAuth } from "../../context/AdminAuthContext";
import adminsData from "../../api/admins.json";

const AdminManagement = () => {
  const { admin } = useAdminAuth();
  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const canCreateAdmin = admin?.permissions?.admins?.create ?? false;
  const canUpdateAdmin = admin?.permissions?.admins?.update ?? false;
  const canDeleteAdmin = admin?.permissions?.admins?.delete ?? false;

  useEffect(() => {
    setAdmins(adminsData);
  }, []);

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      departmentFilter === "all" || admin.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const handleAddAdmin = () => {
    setSelectedAdmin({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "manager",
      department: "",
      employeeId: "",
      permissions: {
        products: {
          read: true,
          create: false,
          update: false,
          delete: false,
          bulkActions: false,
        },
        orders: {
          read: true,
          create: false,
          update: false,
          delete: false,
          refund: false,
          statusChange: false,
        },
        users: {
          read: true,
          create: false,
          update: false,
          delete: false,
          suspend: false,
          viewStats: false,
        },
        subscriptions: {
          read: true,
          create: false,
          update: false,
          delete: false,
          analytics: false,
        },
        analytics: {
          sales: false,
          products: false,
          users: false,
          revenue: false,
          export: false,
        },
        settings: {
          cafe: false,
          tables: false,
          pricing: false,
          notifications: false,
        },
        admins: {
          read: true,
          create: false,
          update: false,
          delete: false,
        },
      },
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditAdmin = (admin) => {
    setSelectedAdmin({ ...admin });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSaveAdmin = () => {
    if (isEditing) {
      setAdmins(
        admins.map((admin) =>
          admin.id === selectedAdmin.id ? selectedAdmin : admin
        )
      );
    } else {
      const newAdmin = {
        ...selectedAdmin,
        id: `admin-${Date.now()}`,
        avatar: "/images/avatars/default.png",
        lastLogin: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      };
      setAdmins([...admins, newAdmin]);
    }
    setShowModal(false);
    setSelectedAdmin(null);
  };

  const handleTogglePermission = (module, permission) => {
    setSelectedAdmin((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: {
          ...prev.permissions[module],
          [permission]: !prev.permissions[module][permission],
        },
      },
    }));
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "admin":
        return "danger";
      case "manager":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getStatusBadge = (isActive) => (
    <Badge bg={isActive ? "success" : "secondary"}>
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );

  const formatLastLogin = (lastLogin) => {
    if (!lastLogin) return "Never";
    return new Date(lastLogin).toLocaleDateString();
  };

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="dashboard-title">Admin Management</h1>
          <p className="dashboard-subtitle">
            Manage admin users and their permissions
          </p>
        </div>
        {canCreateAdmin && (
          <Button
            variant="primary"
            className="btn-admin-primary"
            onClick={handleAddAdmin}
          >
            <i className="fas fa-plus me-2"></i>
            Add Admin
          </Button>
        )}
      </div>

      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <i className="fas fa-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search admins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="all">All Departments</option>
            <option value="Operations">Operations</option>
            <option value="Customer Service">Customer Service</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
          </Form.Select>
        </Col>
      </Row>

      <Card className="admin-card">
        <Card.Body>
          <Table responsive hover className="admin-table">
            <thead>
              <tr>
                <th>Admin</th>
                <th>Role</th>
                <th>Department</th>
                <th>Employee ID</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((admin) => (
                <tr key={admin.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={admin.avatar}
                        alt={admin.name}
                        className="admin-avatar me-3"
                        onError={(e) => {
                          e.target.src = "/images/avatars/default.png";
                        }}
                      />
                      <div>
                        <div className="admin-name">{admin.name}</div>
                        <small className="text-muted">{admin.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge
                      bg={getRoleBadgeVariant(admin.role)}
                      className="text-capitalize"
                    >
                      {admin.role}
                    </Badge>
                  </td>
                  <td>{admin.department}</td>
                  <td>
                    <code className="employee-id">{admin.employeeId}</code>
                  </td>
                  <td>{getStatusBadge(admin.isActive)}</td>
                  <td>{formatLastLogin(admin.lastLogin)}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary" size="sm">
                        <i className="fas fa-ellipsis-v"></i>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleEditAdmin(admin)}>
                          <i className="fas fa-eye me-2"></i>
                          View Details
                        </Dropdown.Item>
                        {canUpdateAdmin && (
                          <Dropdown.Item onClick={() => handleEditAdmin(admin)}>
                            <i className="fas fa-edit me-2"></i>
                            Edit Permissions
                          </Dropdown.Item>
                        )}
                        {canDeleteAdmin && admin.id !== admin?.id && (
                          <>
                            <Dropdown.Divider />
                            <Dropdown.Item className="text-danger">
                              <i className="fas fa-trash me-2"></i>
                              Delete Admin
                            </Dropdown.Item>
                          </>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Edit Admin" : "Add New Admin"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAdmin && (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedAdmin.name}
                      onChange={(e) =>
                        setSelectedAdmin({
                          ...selectedAdmin,
                          name: e.target.value,
                        })
                      }
                      disabled={!canCreateAdmin && !canUpdateAdmin}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={selectedAdmin.email}
                      onChange={(e) =>
                        setSelectedAdmin({
                          ...selectedAdmin,
                          email: e.target.value,
                        })
                      }
                      disabled={!canCreateAdmin && !canUpdateAdmin}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {!isEditing && (
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={selectedAdmin.password || ""}
                        onChange={(e) =>
                          setSelectedAdmin({
                            ...selectedAdmin,
                            password: e.target.value,
                          })
                        }
                        disabled={!canCreateAdmin}
                        placeholder="Enter password"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={selectedAdmin.confirmPassword || ""}
                        onChange={(e) =>
                          setSelectedAdmin({
                            ...selectedAdmin,
                            confirmPassword: e.target.value,
                          })
                        }
                        disabled={!canCreateAdmin}
                        placeholder="Confirm password"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              )}

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                      value={selectedAdmin.role}
                      onChange={(e) =>
                        setSelectedAdmin({
                          ...selectedAdmin,
                          role: e.target.value,
                        })
                      }
                      disabled={!canCreateAdmin && !canUpdateAdmin}
                    >
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Department</Form.Label>
                    <Form.Select
                      value={selectedAdmin.department}
                      onChange={(e) =>
                        setSelectedAdmin({
                          ...selectedAdmin,
                          department: e.target.value,
                        })
                      }
                      disabled={!canCreateAdmin && !canUpdateAdmin}
                    >
                      <option value="">Select Department</option>
                      <option value="Operations">Operations</option>
                      <option value="Customer Service">Customer Service</option>
                      <option value="Finance">Finance</option>
                      <option value="Marketing">Marketing</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Employee ID</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedAdmin.employeeId}
                      onChange={(e) =>
                        setSelectedAdmin({
                          ...selectedAdmin,
                          employeeId: e.target.value,
                        })
                      }
                      disabled={!canCreateAdmin && !canUpdateAdmin}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <hr />
              <h6 className="mb-3">Permissions</h6>

              {Object.entries(selectedAdmin.permissions).map(
                ([module, perms]) => (
                  <Card key={module} className="mb-3">
                    <Card.Header>
                      <h6 className="mb-0 text-capitalize">{module}</h6>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        {Object.entries(perms).map(([permission, value]) => (
                          <Col key={permission} md={4} className="mb-2">
                            <Form.Check
                              type="checkbox"
                              label={
                                permission.charAt(0).toUpperCase() +
                                permission.slice(1)
                              }
                              checked={value}
                              onChange={() =>
                                handleTogglePermission(module, permission)
                              }
                              disabled={!canCreateAdmin && !canUpdateAdmin}
                            />
                          </Col>
                        ))}
                      </Row>
                    </Card.Body>
                  </Card>
                )
              )}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          {(canCreateAdmin || canUpdateAdmin) && (
            <Button variant="primary" onClick={handleSaveAdmin}>
              {isEditing ? "Update Admin" : "Create Admin"}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminManagement;
