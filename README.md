# AWS 3-Tier Web Application: Brick Breaker Game

This project demonstrates the deployment of a classic 3-tier architecture on AWS from scratch. The application is a simple "Brick Breaker" web game where the frontend is separated from the backend logic, which handles high scores stored in a relational database.

## Architecture Diagram


*(Možeš kasnije ovdje dodati sliku arhitekture)*

---

## Tiers & AWS Services Used

### 1. Web Tier (Presentation Layer)
* **Component:** A static HTML/CSS/JavaScript frontend for the Brick Breaker game.
* **AWS Service:** An **Amazon EC2** instance running in a **public subnet**.
* **Details:** Nginx is used as the web server to serve the static files. This tier is the public entry point for users and is configured with a Security Group that allows HTTP/HTTPS traffic from anywhere. It also acts as a reverse proxy, forwarding API calls to the private Application Tier.

### 2. Application Tier (Logic Layer)
* **Component:** A simple Python **Flask API** with endpoints to `GET` and `POST` high scores.
* **AWS Service:** An **Amazon EC2** instance running in a **private subnet**.
* **Details:** This server is not directly accessible from the internet. Its Security Group only allows traffic from the Web Tier, ensuring the application logic is protected. It reads database credentials from environment variables for security.

### 3. Database Tier (Data Layer)
* **Component:** A MySQL database to store player names and scores.
* **AWS Service:** **Amazon RDS (Relational Database Service)** running in a **private subnet**.
* **Details:** The database is in the most secure part of the network. Its Security Group is the most restrictive, only allowing traffic on the MySQL port (3306) from the Application Tier's Security Group.

---

## Core Infrastructure
* **VPC:** A custom Virtual Private Cloud was built with both public and private subnets across two Availability Zones to ensure high availability.
* **NAT Gateway:** A NAT Gateway was used to allow the private application server to access the internet for software updates without being publicly exposed.
* **Security:** Communication between tiers is strictly controlled by Security Groups, implementing the principle of least privilege. SSH access to the private application server is only possible by using the public web server as a "jumphost" or "bastion host".

---

## Screenshots

*Game running in the browser:*

*(Ovdje možeš dodati link na screenshot, npr. ![Game Screenshot](screenshots/ime-slike.png))*
