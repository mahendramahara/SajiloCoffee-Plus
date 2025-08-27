import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Badge, ProgressBar } from "react-bootstrap";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from "chart.js";
import StatsCard from "../../components/admin/Dashboard/StatsCard";
import ChartCard from "../../components/admin/Dashboard/ChartCard";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { adminApi } from "../../api/adminApi";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement);

const Dashboard = () => {
  const { admin } = useAdminAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await adminApi.getDashboardStats();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const salesChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    datasets: [{
      label: "Sales (NPR)",
      data: dashboardData?.revenue?.daily?.map(d => d.revenue) || [15000, 18000, 22000, 19000, 25000, 28000, 32000, 35000],
      borderColor: "#8B4513",
      backgroundColor: "rgba(139, 69, 19, 0.1)",
      tension: 0.4,
    }],
  };

  const orderStatusData = {
    labels: ["Completed", "Preparing", "Served", "Cancelled"],
    datasets: [{
      data: [45, 25, 20, 10],
      backgroundColor: ["#28a745", "#ffc107", "#17a2b8", "#dc3545"],
      borderWidth: 0,
    }],
  };

  const productCategoryData = {
    labels: ["Espresso", "Milk Coffee", "Cold Brew", "Specialty", "Tea"],
    datasets: [{
      label: "Orders",
      data: [35, 45, 25, 30, 15],
      backgroundColor: ["#8B4513", "#D2691E", "#CD853F", "#DEB887", "#F4A460"],
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" } },
  };

  if (loading) {
    return (
      <Container fluid>
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="dashboard-container admin-dashboard">
      <div className="dashboard-header mb-3">
        <h1 className="dashboard-title compact-title">Dashboard</h1>
        <p className="dashboard-subtitle compact-subtitle">
          Welcome back{admin ? `, ${admin.name}` : ''}! Here's what's happening at SajiloCoffee+ today.
        </p>
      </div>

      <Row className="stats-row mb-3">
        <Col lg={4} md={6} sm={12} className="mb-3">
          <StatsCard
            title="Total Orders"
            value={dashboardData?.overview?.total?.orders || 0}
            icon="fa-shopping-cart"
            bgColor="bg-primary"
          />
        </Col>
        <Col lg={4} md={6} sm={12} className="mb-3">
          <StatsCard
            title="Total Users"
            value={dashboardData?.overview?.total?.users || 0}
            icon="fa-users"
            bgColor="bg-success"
          />
        </Col>
        <Col lg={4} md={6} sm={12} className="mb-3">
          <StatsCard
            title="Total Revenue"
            value={`₨${(dashboardData?.overview?.total?.revenue || 0).toLocaleString()}`}
            icon="fa-dollar-sign"
            bgColor="bg-info"
          />
        </Col>
      </Row>

      <Row className="stats-row mb-3">
        <Col lg={4} md={6} sm={12} className="mb-3">
          <StatsCard
            title="Active Subscriptions"
            value={dashboardData?.overview?.total?.activeSubscriptions || 0}
            icon="fa-crown"
            bgColor="bg-warning"
          />
        </Col>
        <Col lg={4} md={6} sm={12} className="mb-3">
          <StatsCard
            title="Today's Orders"
            value={dashboardData?.overview?.today?.orders || 0}
            icon="fa-clock"
            bgColor="bg-danger"
          />
        </Col>
        <Col lg={4} md={6} sm={12} className="mb-3">
          <StatsCard
            title="Pending Orders"
            value={dashboardData?.orders?.statusDistribution?.find(s => s._id === 'pending')?.count || 0}
            icon="fa-hourglass-half"
            bgColor="bg-secondary"
          />
        </Col>
      </Row>

      <Row className="charts-row mb-3">
        <Col lg={8} className="mb-3">
          <ChartCard title="Sales Overview" height="250px">
            <Line data={salesChartData} options={chartOptions} />
          </ChartCard>
        </Col>
        <Col lg={4} className="mb-3">
          <ChartCard title="Order Status" height="250px">
            <Doughnut data={orderStatusData} options={chartOptions} />
          </ChartCard>
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
                  {(dashboardData?.recentActivity?.recentOrders || []).slice(0, 5).map((order) => (
                    <tr key={order.id}>
                      <td><span className="order-id">#{order.id.slice(-8)}</span></td>
                      <td><span className="table-number">Table {order.table}</span></td>
                      <td><span className="order-total">₨{order.total}</span></td>
                      <td>
                        <Badge bg={order.status === 'served' ? 'success' : order.status === 'preparing' ? 'warning' : 'secondary'}>
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
                {(dashboardData?.products?.topByRevenue || []).slice(0, 5).map((product, index) => (
                  <div key={product._id} className="product-item">
                    <div className="product-rank">#{index + 1}</div>
                    <div className="product-info">
                      <h6 className="product-name">{product.productName}</h6>
                      <p className="product-category text-muted">{product.category}</p>
                    </div>
                    <div className="product-stats">
                      <span className="order-count">{product.totalSold} sold</span>
                      <ProgressBar
                        now={(product.revenue / (dashboardData?.products?.topByRevenue?.[0]?.revenue || 1)) * 100}
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
          <ChartCard title="Product Categories Performance" height="300px">
            <Bar data={productCategoryData} options={chartOptions} />
          </ChartCard>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
