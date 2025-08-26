import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  ProgressBar,
} from "react-bootstrap";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";

import ordersData from "../../api/orders.json";
import usersData from "../../api/users.json";
import productsData from "../../api/products.json";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    todayOrders: 0,
    pendingOrders: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    calculateStats();
    setRecentOrders(ordersData.slice(0, 5));
    calculateTopProducts();
  }, []);

  const calculateStats = () => {
    const totalOrders = ordersData.length;
    const totalUsers = usersData.length;
    const totalRevenue = ordersData.reduce(
      (sum, order) => sum + order.total,
      0
    );
    const activeSubscriptions = usersData.filter(
      (user) => user.subscription && user.subscription.status === "active"
    ).length;

    const today = new Date().toISOString().split("T")[0];
    const todayOrders = ordersData.filter(
      (order) => order.placedAt.split("T")[0] === today
    ).length;

    const pendingOrders = ordersData.filter(
      (order) => order.status === "preparing" || order.status === "pending"
    ).length;

    setStats({
      totalOrders,
      totalUsers,
      totalRevenue,
      activeSubscriptions,
      todayOrders,
      pendingOrders,
    });
  };

  const calculateTopProducts = () => {
    const productCounts = {};

    ordersData.forEach((order) => {
      order.items.forEach((item) => {
        const product = productsData.find((p) => p.id === item.productId);
        if (product) {
          productCounts[product.id] =
            (productCounts[product.id] || 0) + item.qty;
        }
      });
    });

    const sortedProducts = Object.entries(productCounts)
      .map(([productId, count]) => ({
        ...productsData.find((p) => p.id === productId),
        orderCount: count,
      }))
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, 5);

    setTopProducts(sortedProducts);
  };

  const salesChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    datasets: [
      {
        label: "Sales (NPR)",
        data: [15000, 18000, 22000, 19000, 25000, 28000, 32000, 35000],
        borderColor: "#8B4513",
        backgroundColor: "rgba(139, 69, 19, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const orderStatusData = {
    labels: ["Completed", "Preparing", "Served", "Cancelled"],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: ["#28a745", "#ffc107", "#17a2b8", "#dc3545"],
        borderWidth: 0,
      },
    ],
  };

  const productCategoryData = {
    labels: ["Espresso", "Milk Coffee", "Cold Brew", "Specialty", "Tea"],
    datasets: [
      {
        label: "Orders",
        data: [35, 45, 25, 30, 15],
        backgroundColor: [
          "#8B4513",
          "#D2691E",
          "#CD853F",
          "#DEB887",
          "#F4A460",
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const getOrderStatusBadge = (status) => {
    const variants = {
      preparing: "warning",
      served: "success",
      pending: "secondary",
      cancelled: "danger",
    };
    return variants[status] || "primary";
  };

  return (
    <Container fluid className="dashboard-container admin-dashboard">
      <div className="dashboard-header mb-3">
        <h1 className="dashboard-title compact-title">Dashboard</h1>
        <p className="dashboard-subtitle compact-subtitle">
          Welcome back! Here's what's happening at SajiloCoffee+ today.
        </p>
      </div>

      <Row className="stats-row mb-3">
        <Col lg={4} md={6} sm={12} className="mb-3">
          <Card className="stat-card h-100">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon bg-primary">
                  <i className="fas fa-shopping-cart"></i>
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">{stats.totalOrders}</h3>
                  <p className="stat-label">Total Orders</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={6} sm={12} className="mb-3">
          <Card className="stat-card h-100">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon bg-success">
                  <i className="fas fa-users"></i>
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">{stats.totalUsers}</h3>
                  <p className="stat-label">Total Users</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={6} sm={12} className="mb-3">
          <Card className="stat-card h-100">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon bg-info">
                  <i className="fas fa-dollar-sign"></i>
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">
                    ₨{stats.totalRevenue.toLocaleString()}
                  </h3>
                  <p className="stat-label">Total Revenue</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="stats-row mb-3">
        <Col lg={4} md={6} sm={12} className="mb-3">
          <Card className="stat-card h-100">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon bg-warning">
                  <i className="fas fa-crown"></i>
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">{stats.activeSubscriptions}</h3>
                  <p className="stat-label">Active Subscriptions</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={6} sm={12} className="mb-3">
          <Card className="stat-card h-100">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon bg-danger">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">{stats.todayOrders}</h3>
                  <p className="stat-label">Today's Orders</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={6} sm={12} className="mb-3">
          <Card className="stat-card h-100">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon bg-secondary">
                  <i className="fas fa-hourglass-half"></i>
                </div>
                <div className="stat-details">
                  <h3 className="stat-number">{stats.pendingOrders}</h3>
                  <p className="stat-label">Pending Orders</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="charts-row mb-3">
        <Col lg={8} className="mb-3">
          <Card className="chart-card h-100">
            <Card.Header>
              <h5 className="card-title">Sales Overview</h5>
            </Card.Header>
            <Card.Body>
              <div className="chart-container" style={{ height: "250px" }}>
                <Line data={salesChartData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} className="mb-3">
          <Card className="chart-card h-100">
            <Card.Header>
              <h5 className="card-title">Order Status</h5>
            </Card.Header>
            <Card.Body>
              <div className="chart-container" style={{ height: "250px" }}>
                <Doughnut data={orderStatusData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="data-row">
        <Col lg={6} className="mb-3">
          <Card className="data-card h-100">
            <Card.Header>
              <h5 className="card-title">Recent Orders</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover className="recent-orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Table</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <span className="order-id">#{order.id.slice(-8)}</span>
                      </td>
                      <td>
                        <span className="table-number">
                          Table {order.table}
                        </span>
                      </td>
                      <td>
                        <span className="order-total">₨{order.total}</span>
                      </td>
                      <td>
                        <Badge
                          bg={getOrderStatusBadge(order.status)}
                          className="status-badge"
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td>
                        <small className="text-muted">
                          {new Date(order.placedAt).toLocaleTimeString()}
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card className="data-card h-100">
            <Card.Header>
              <h5 className="card-title">Top Products</h5>
            </Card.Header>
            <Card.Body>
              <div className="top-products">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="product-item">
                    <div className="product-rank">#{index + 1}</div>
                    <div className="product-info">
                      <h6 className="product-name">{product.name}</h6>
                      <p className="product-category text-muted">
                        {product.category}
                      </p>
                    </div>
                    <div className="product-stats">
                      <span className="order-count">
                        {product.orderCount} orders
                      </span>
                      <ProgressBar
                        now={
                          (product.orderCount / topProducts[0].orderCount) * 100
                        }
                        variant="primary"
                        className="mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <Card className="chart-card">
            <Card.Header>
              <h5 className="card-title">Product Categories Performance</h5>
            </Card.Header>
            <Card.Body>
              <div className="chart-container" style={{ height: "300px" }}>
                <Bar data={productCategoryData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
