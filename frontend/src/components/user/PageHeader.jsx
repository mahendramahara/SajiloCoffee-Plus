import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const PageHeader = ({ title, subtitle, icon }) => {
  return (
    <div className="page-header">
      <Container>
        <Row>
          <Col lg={8} className="mx-auto text-center">
            <h1 className="display-5 fw-bold text-primary mb-3">
              {icon && <i className={`${icon} me-3`}></i>}
              {title}
            </h1>
            {subtitle && <p className="lead text-muted">{subtitle}</p>}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PageHeader;
