# AWS 3-Tier Web Application: Brick Breaker Game

This project demonstrates a hands-on implementation of a classic 3-tier architecture on AWS, built from the ground up. The application is a playable "Brick Breaker" web game with a backend API to handle high scores, which are persisted in a relational database.

This repository contains the application code and documentation for the project.

---

## Architecture Overview

The infrastructure is designed following AWS best practices for security, scalability, and high availability.

* **VPC:** A custom Virtual Private Cloud provides a logically isolated section of the AWS Cloud. It is configured with:
    * **Public Subnets:** For resources that need to be internet-facing, like the web server.
    * **Private Subnets:** For backend resources like the application server and database, which should not be directly accessible from the internet.
    * **Availability Zones:** The VPC spans two AZs to ensure high availability and fault tolerance.
* **Networking:** An **Internet Gateway** provides access to the internet for the public subnets. **NAT Gateways** are placed in the public subnets to allow resources in the private subnets (like the application server) to initiate outbound traffic for software updates, while remaining unreachable from the external internet.
* **Security:**
    * **Security Groups** act as stateful virtual firewalls, controlling traffic between the tiers at the instance level. Rules are configured to enforce the principle of least privilege.
    * **Network ACLs** (default settings) provide an additional, stateless layer of security at the subnet level.

---

## Tiers & AWS Services Implemented

### 1. Web Tier (Presentation Layer)
* **Description:** Serves the static frontend content (HTML, CSS, JavaScript) of the Brick Breaker game to the user's browser.
* **AWS Service:** **Amazon EC2** instance running an Ubuntu Server.
* **Configuration:**
    * Launched in a **public subnet**.
    * Assigned a public IP address.
    * **Nginx** is installed and configured as the web server.
    * Nginx also functions as a **reverse proxy**, securely forwarding API calls from the client (e.g., `/api/score`) to the private Application Tier.
    * The `web-sg` Security Group allows inbound traffic on ports 80 (HTTP) and 443 (HTTPS) from anywhere (`0.0.0.0/0`).

### 2. Application Tier (Logic Layer)
* **Description:** Handles the core business logic. It exposes a RESTful API built with Python and Flask to create and retrieve high scores.
* **AWS Service:** **Amazon EC2** instance running an Ubuntu Server.
* **Configuration:**
    * Launched in a **private subnet**, making it inaccessible from the public internet.
    * Does not have a public IP address.
    * The Flask application reads database credentials securely from environment variables, not from hardcoded text.
    * The `app-sg` Security Group only allows inbound traffic on port 8080 from the `web-sg`, and SSH traffic from the `web-sg` (acting as a bastion host).

### 3. Database Tier (Data Layer)
* **Description:** Persists application data, specifically the high scores.
* **AWS Service:** **Amazon RDS** for MySQL.
* **Configuration:**
    * Launched in a **private subnet** for maximum security.
    * The `baza-sg` Security Group is the most restrictive, only allowing inbound traffic on the MySQL port (3306) from the `app-sg`.

---

## Screenshots

*Game running in the browser:*
![EC89AF8D-7584-4E79-BE75-5DB8BA5C089E_1_105_c](https://github.com/user-attachments/assets/0880dcdd-b0c4-4568-af15-29669f4d736a)

*Successfully saving a high score to the database:*

![30624C1D-466D-433F-B98A-D4A05C904EF8](https://github.com/user-attachments/assets/48e334af-d48d-4c80-90a0-cc9c593aa1e7)

### Direct Database Verification

To confirm the end-to-end functionality of the entire architecture, a direct connection was established to the MySQL database from within the private `app-server`. The screenshot below shows the output of a `SELECT * FROM scores;` query.



*![18026546-FEF3-48C8-812D-6F34238A1AD3](https://github.com/user-attachments/assets/d71a0c1e-66f3-48a4-94af-ba99339a62ee)*

**
