import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Form,
} from "react-bootstrap";
import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import analyticsData from "../../api/analytics.json";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("7days");
  const [currentData, setCurrentData] = useState({});

  const processAnalyticsData = useCallback(() => {
    const salesData = analyticsData.salesData.daily.slice(-7);
    const productData = analyticsData.productPerformance.slice(0, 6);

    setCurrentData({
      sales: salesData,
      products: productData,
      stats: analyticsData.dashboardStats,
      notifications: analyticsData.notifications.slice(0, 5),
      activity: analyticsData.recentActivity.slice(0, 6),
      demographics: analyticsData.customerAnalytics.demographics,
    });
  }, []);

  useEffect(() => {
    processAnalyticsData();
  }, [processAnalyticsData]);

  // Chart configurations optimized for small screens
  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 8,
          fontSize: 10,
          boxWidth: 12,
          font: { size: 10 },
        },
      },
      tooltip: {
        titleFont: { size: 11 },
        bodyFont: { size: 10 },
        padding: 6,
      },
    },
    scales: {
      x: {
        ticks: { font: { size: 9 } },
        grid: { display: false },
      },
      y: {
        ticks: { font: { size: 9 } },
        grid: { color: "#f0f0f0" },
      },
    },
  };

  const salesChartData = {
    labels:
      currentData.sales?.map((item) =>
        new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      ) || [],
    datasets: [
      {
        label: "Revenue (₨)",
        data: currentData.sales?.map((item) => item.revenue) || [],
        borderColor: "#8B4513",
        backgroundColor: "rgba(139, 69, 19, 0.1)",
        tension: 0.4,
        fill: true,
        borderWidth: 2,
        pointRadius: 3,
      },
    ],
  };

  const productChartData = {
    labels:
      currentData.products?.map((item) =>
        item.name.length > 15 ? item.name.substring(0, 12) + "..." : item.name
      ) || [],
    datasets: [
      {
        label: "Revenue (₨)",
        data: currentData.products?.map((item) => item.revenue) || [],
        backgroundColor: [
          "#8B4513",
          "#D2691E",
          "#CD853F",
          "#DEB887",
          "#F4A460",
          "#BC8F8F",
        ],
        borderWidth: 0,
      },
    ],
  };

  const categoryData = {
    labels: ["Coffee", "Food", "Specialty", "Tea", "Desserts"],
    datasets: [
      {
        data: [45, 25, 15, 10, 5],
        backgroundColor: [
          "#8B4513",
          "#D2691E",
          "#17A2B8",
          "#FFC107",
          "#28A745",
        ],
        borderWidth: 0,
      },
    ],
  };

  const ageGroupData = {
    labels:
      currentData.demographics?.ageGroups?.map((group) => group.range) || [],
    datasets: [
      {
        data:
          currentData.demographics?.ageGroups?.map((group) => group.count) ||
          [],
        backgroundColor: [
          "#8B4513",
          "#D2691E",
          "#CD853F",
          "#DEB887",
          "#F4A460",
        ],
        borderWidth: 0,
      },
    ],
  };

  const formatCurrency = (amount) => `₨${amount?.toLocaleString()}`;
  const formatNumber = (num) => num?.toLocaleString();

  const getTimeSince = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <Container fluid className="analytics-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h1 className="dashboard-title compact-title">Analytics Dashboard</h1>
          <p className="dashboard-subtitle compact-subtitle">
            Business insights and performance metrics
          </p>
        </div>
        <div className="d-flex gap-2">
          <Form.Select
            size="sm"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{ width: "120px" }}
          >
            <option value="7days">7 Days</option>
            <option value="30days">30 Days</option>
            <option value="90days">90 Days</option>
          </Form.Select>
          <Button variant="outline-primary" size="sm">
            <i className="fas fa-download me-1"></i>Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Row */}
      <Row className="mb-3">
        <Col xl={3} lg={6} md={6} sm={12} className="mb-2">
          <Card className="stat-card compact-stat-card">
            <Card.Body className="p-2">
              <div className="stat-content">
                <div className="stat-icon bg-primary">
                  <i className="fas fa-rupee-sign"></i>
                </div>
                <div className="stat-details">
                  <h6 className="stat-number compact-number">
                    {formatCurrency(currentData.stats?.totalRevenue)}
                  </h6>
                  <p className="stat-label compact-label">Total Revenue</p>
                  <small className="text-success">
                    <i className="fas fa-arrow-up"></i> +22.1%
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} lg={6} md={6} sm={12} className="mb-2">
          <Card className="stat-card compact-stat-card">
            <Card.Body className="p-2">
              <div className="stat-content">
                <div className="stat-icon bg-success">
                  <i className="fas fa-shopping-cart"></i>
                </div>
                <div className="stat-details">
                  <h6 className="stat-number compact-number">
                    {formatNumber(currentData.stats?.totalOrders)}
                  </h6>
                  <p className="stat-label compact-label">Total Orders</p>
                  <small className="text-success">
                    <i className="fas fa-arrow-up"></i> +18.5%
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} lg={6} md={6} sm={12} className="mb-2">
          <Card className="stat-card compact-stat-card">
            <Card.Body className="p-2">
              <div className="stat-content">
                <div className="stat-icon bg-info">
                  <i className="fas fa-users"></i>
                </div>
                <div className="stat-details">
                  <h6 className="stat-number compact-number">
                    {formatNumber(currentData.stats?.totalCustomers)}
                  </h6>
                  <p className="stat-label compact-label">Customers</p>
                  <small className="text-success">
                    <i className="fas fa-arrow-up"></i> +12.3%
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} lg={6} md={6} sm={12} className="mb-2">
          <Card className="stat-card compact-stat-card">
            <Card.Body className="p-2">
              <div className="stat-content">
                <div className="stat-icon bg-warning">
                  <i className="fas fa-star"></i>
                </div>
                <div className="stat-details">
                  <h6 className="stat-number compact-number">
                    {currentData.stats?.customerSatisfaction}/5.0
                  </h6>
                  <p className="stat-label compact-label">Satisfaction</p>
                  <small className="text-success">
                    <i className="fas fa-arrow-up"></i> +0.2
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row className="mb-3">
        <Col lg={8} className="mb-3">
          <Card className="data-card compact-chart-card">
            <Card.Header className="p-2">
              <h6 className="card-title compact-card-title mb-0">
                Sales Trend
              </h6>
            </Card.Header>
            <Card.Body className="p-2">
              <div style={{ height: "200px" }}>
                <Line data={salesChartData} options={commonChartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} className="mb-3">
          <Card className="data-card compact-chart-card">
            <Card.Header className="p-2">
              <h6 className="card-title compact-card-title mb-0">
                Category Distribution
              </h6>
            </Card.Header>
            <Card.Body className="p-2">
              <div style={{ height: "200px" }}>
                <Doughnut
                  data={categoryData}
                  options={{
                    ...commonChartOptions,
                    plugins: {
                      ...commonChartOptions.plugins,
                      legend: {
                        position: "right",
                        labels: {
                          padding: 4,
                          fontSize: 9,
                          boxWidth: 8,
                          font: { size: 9 },
                        },
                      },
                    },
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Performance and Activity Row */}
      <Row className="mb-3">
        <Col lg={7} className="mb-3">
          <Card className="data-card compact-table-card">
            <Card.Header className="p-2">
              <h6 className="card-title compact-card-title mb-0">
                Top Products
              </h6>
            </Card.Header>
            <Card.Body className="p-1">
              <Table responsive hover size="sm" className="compact-table mb-0">
                <thead>
                  <tr>
                    <th className="compact-th">Product</th>
                    <th className="compact-th">Revenue</th>
                    <th className="compact-th">Units</th>
                    <th className="compact-th">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.products?.map((product, index) => (
                    <tr key={product.id}>
                      <td className="compact-td">
                        <div className="d-flex align-items-center">
                          <span className="rank-badge-small me-2">
                            {index + 1}
                          </span>
                          <div>
                            <div className="product-name-small">
                              {product.name}
                            </div>
                            <small className="text-muted">
                              {product.category}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td className="compact-td">
                        <strong className="text-success">
                          {formatCurrency(product.revenue)}
                        </strong>
                      </td>
                      <td className="compact-td">
                        {formatNumber(product.unitsSold)}
                      </td>
                      <td className="compact-td">
                        <Badge bg="success" className="compact-badge">
                          <i className="fas fa-arrow-up"></i> {product.growth}%
                        </Badge>
                      </td>
                    </tr>
                  )) || []}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={5} className="mb-3">
          <Card className="data-card compact-table-card">
            <Card.Header className="p-2">
              <h6 className="card-title compact-card-title mb-0">
                Recent Activity
              </h6>
            </Card.Header>
            <Card.Body className="p-2">
              <div className="activity-feed compact-activity">
                {currentData.activity?.map((activity) => (
                  <div
                    key={activity.id}
                    className="activity-item compact-activity-item"
                  >
                    <div
                      className={`activity-icon compact-icon bg-${activity.color}`}
                    >
                      <i className={`fas fa-${activity.icon}`}></i>
                    </div>
                    <div className="activity-content compact-content">
                      <p className="activity-text compact-text mb-0">
                        {activity.description}
                      </p>
                      {activity.amount && (
                        <strong className="activity-amount">
                          {formatCurrency(activity.amount)}
                        </strong>
                      )}
                      <small className="text-muted d-block">
                        {getTimeSince(activity.timestamp)}
                      </small>
                    </div>
                  </div>
                )) || []}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bottom Charts Row */}
      <Row>
        <Col lg={6} className="mb-3">
          <Card className="data-card compact-chart-card">
            <Card.Header className="p-2">
              <h6 className="card-title compact-card-title mb-0">
                Product Performance
              </h6>
            </Card.Header>
            <Card.Body className="p-2">
              <div style={{ height: "180px" }}>
                <Bar
                  data={productChartData}
                  options={{
                    ...commonChartOptions,
                    plugins: {
                      ...commonChartOptions.plugins,
                      legend: { display: false },
                    },
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6} className="mb-3">
          <Card className="data-card compact-chart-card">
            <Card.Header className="p-2">
              <h6 className="card-title compact-card-title mb-0">
                Customer Demographics
              </h6>
            </Card.Header>
            <Card.Body className="p-2">
              <div style={{ height: "180px" }}>
                <Pie
                  data={ageGroupData}
                  options={{
                    ...commonChartOptions,
                    plugins: {
                      ...commonChartOptions.plugins,
                      legend: {
                        position: "right",
                        labels: {
                          padding: 4,
                          fontSize: 9,
                          boxWidth: 8,
                          font: { size: 9 },
                        },
                      },
                    },
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Analytics;
