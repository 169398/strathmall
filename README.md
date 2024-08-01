# Welcome to the StrathMall 🫠 
Here you'll find all the documentation related to the StrathMall project.

## Table of Contents 📑

- [Introduction](#introduction) 
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## Introduction
StrathMall is a marketplace for all university and local sellers. This wiki provides detailed information about the project, including how to get started, project structure, API documentation, and guidelines for contributing.


## Getting Started

Welcome to the StrathMall project! This guide will help you set up your development environment and get the project running locally.

## Prerequisites
- Node.js
- npm or yarn
- A GitHub account

## Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/strathmall.git
   cd strathmall

2.Install Dependancies
   ```bash
   npm install
```
3.Run the project on your local server
```bash
   npm run dev
```
4.Open the live project
```bash
localhost:3000
```

#### Project Structure

# Project Structure

The StrathMall project is organized as follows:

- `src/`: Contains the source code for the project.
  - `components/`: Reusable UI components.
  - `pages/`: Next.js pages.
  - `styles/`: CSS and styling files.
  - `lib/`: Utility functions and libraries.
  - `hooks/`: Custom React hooks.
- `public/`: Static assets such as images and fonts.
- `README.md`: Project overview and setup instructions.
- `package.json`: Project dependencies and scripts.

For more information on each section, please refer to the relevant documentation pages.

## API Documentation
## Overview
This page provides detailed information about the APIs used in the StrathMall project.

## Endpoints

### GET /api/products
Fetches a list of products.

**Parameters**:
- `category`: (optional) Filter products by category.
- `limit`: (optional) Limit the number of products returned.

**Response**:
```json
{
  "data": [
    {
      "id": "1",
      "name": "Product 1",
      "price": "10.00",
      "sellerId":"userId",
      "userId" : "userId",

    },
   
  ]
}


```


## Contributing 🫠

Thank you for considering contributing to StrathMall! We welcome contributions from the community. Please follow these guidelines to make the process smooth and efficient.

## How to Contribute
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name

```
Worn out🥵
//TO DO 😫  :Continue the documentation **APIs**  ❗ 
