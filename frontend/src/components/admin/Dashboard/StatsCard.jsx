import React from 'react';
import { Card } from 'react-bootstrap';

const StatsCard = ({ title, value, icon, bgColor, subtitle, trend }) => {
  return (
    <Card className="stat-card h-100">
      <Card.Body>
        <div className="stat-content">
          <div className={`stat-icon ${bgColor}`}>
            <i className={`fas ${icon}`}></i>
          </div>
          <div className="stat-details">
            <h3 className="stat-number">{value}</h3>
            <p className="stat-label">{title}</p>
            {subtitle && <small className="text-muted">{subtitle}</small>}
            {trend && (
              <div className={`trend ${trend.type}`}>
                <i className={`fas ${trend.type === 'up' ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
                {trend.value}%
              </div>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatsCard;
