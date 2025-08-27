import React from 'react';
import { Card } from 'react-bootstrap';

const ChartCard = ({ title, children, height = "300px" }) => {
  return (
    <Card className="chart-card h-100">
      <Card.Header>
        <h5 className="card-title">{title}</h5>
      </Card.Header>
      <Card.Body>
        <div className="chart-container" style={{ height }}>
          {children}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ChartCard;
