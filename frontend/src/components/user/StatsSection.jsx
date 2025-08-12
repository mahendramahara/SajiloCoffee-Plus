import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const StatsSection = ({ stats }) => {
  return (
    <section className="stats-section">
      <Container className="py-5">
        <Row>
          {stats.map((stat, index) => (
            <Col lg={3} md={6} key={index} className="mb-4">
              <div className="stats-card">
                <div className="stats-icon">
                  <i className={`bi ${stat.icon}`}></i>
                </div>
                <h3 className="stats-value">{stat.value}</h3>
                <p className="stats-label">{stat.label}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default StatsSection;
