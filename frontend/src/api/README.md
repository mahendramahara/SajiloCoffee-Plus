# SajiloCoffee+ Mock API Data

This directory contains mock JSON data files that simulate API responses for the SajiloCoffee+ frontend application. All data uses UUIDs for consistency and realistic referencing.

## Files Overview

### Core Data Files

- **products.json** - Coffee products with Nepali-inspired names, prices in NPR
- **users.json** - Customer profiles with preferences and order history
- **orders.json** - Order records with items, pricing, and status
- **tables.json** - Restaurant table management data
- **subscriptions.json** - Coffee subscription plans and user subscriptions
- **ratings.json** - Product ratings and reviews from users
- **recommendations.json** - Personalized product recommendations
- **admins.json** - Admin users with role-based permissions

## Data Structure

### UUID System

All entities use UUIDs for identification:

- Products: `550e8400-e29b-41d4-a716-446655440xxx`
- Users: `6ba7b810-9dad-11d1-80b4-00c04fd430xx`
- Orders: `123e4567-e89b-12d3-a456-426614174xxx`
- Subscriptions: `f47ac10b-58cc-4372-a567-0e02b2c3d4xx`
- Admins: `a1b2c3d4-e5f6-4789-a012-3456789abcxx`

### Cross-References

Data files reference each other using UUIDs:

- Orders reference users and products
- Ratings reference users and products
- Recommendations reference users and products
- Users reference their subscriptions and order history
- Tables reference current orders

## Usage

Import these files in your React components to simulate API calls:

```javascript
import products from "../api/products.json";
import users from "../api/users.json";
import orders from "../api/orders.json";
// etc.
```

## Nepali Context

All data includes Nepali cultural context:

- Product names inspired by Nepali locations
- Pricing in NPR (Nepali Rupees)
- User names and preferences reflecting local culture
- Seasonal recommendations and traditional flavors
