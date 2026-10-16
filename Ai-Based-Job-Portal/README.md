# AI-Based Job Portal

[![Java Version](https://img.shields.io/badge/Java-25-orange.svg?style=for-the-badge&logo=openjdk)](https://openjdk.org/)
[![Spring Boot Version](https://img.shields.io/badge/Spring--Boot-3.3.4-brightgreen.svg?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![Build Tool](https://img.shields.io/badge/Maven-3.8%2B-blue.svg?style=for-the-badge&logo=apachemaven)](https://maven.apache.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge&logo=github)](https://opensource.org/licenses/MIT)

An intelligent, full-stack recruitment portal featuring automated AI resume screening, job-matching analytics, and a custom candidate emailing suite. The application leverages a Spring Boot backend integrated with a local Ollama LLM to scan candidates against job descriptions in real-time, paired with a modern React client that streamlines candidate tracking and recruiter outreach.

---

## 🌟 Key Features

*   🧠 **AI Resume Screening:** Extracts text from uploaded candidate PDF resumes and calls a local **Ollama** model (`llama3.2`) to generate an AI Match Score, key strengths, missing skills feedback, and developer suggestions.
*   📬 **Automated Status Notifications:** Sends automated emails via SMTP to candidates when their application status is updated (e.g., shortlisted for interviews or hired).
*   📧 **Recruiter Custom Email Suite:** Allows recruiters to compose custom emails or choose pre-designed HTML email templates (Shortlist, Offer, Rejection) to send notifications directly to candidates.
*   🔐 **Secure Stateless Authentication:** Configures stateless user sessions secured by Spring Security and JWT tokens featuring a 24-hour expiration lifespan.
*   📦 **Recruiter Dashboard:** Complete panel allowing recruiters to manage companies, publish detailed job listings, view live applications, and audit candidate details.
*   🛒 **Candidate CV Manager:** Simple interface for candidates to build profile cards, input education or social links, and upload PDF CVs.
*   ✨ **Rich Visual Aesthetics:** Styled using smooth transitions, framer-motion micro-animations, glassmorphism layouts, and dark mode compliance.

---

## 🏗️ Architecture & Project Directory Structure

The system utilizes a **Layered Architecture** for the Spring Boot backend server. Data flows from HTTP controllers down to the service implementation classes and JPA repositories.

```text
Ai-Based-Job-Portal/
├── src/main/java/com/raj/Ai_Based_Job_Portal/
│   ├── config/                # Spring AI, OpenAPI & global security configurations
│   ├── controller/            # REST API endpoints (Auth, Jobs, Email, Resumes, AI)
│   ├── dto/                   # Request/Response Data Transfer Objects
│   ├── entity/                # JPA Database Entities (User, Job, Resume)
│   ├── repository/            # Spring Data JPA Repository interfaces
│   ├── security/              # JWT Token filter and user details service
│   └── service/impl/          # Business interfaces & implementations
├── src/main/resources/
│   ├── application.properties # Main application properties (MySQL, MariaDB Vector Store, Mail, Ollama)
│   └── uploads/               # Directory for storing candidate resume PDFs
├── docker-compose.yml         # Docker compose for DB infrastructure
└── pom.xml                    # Maven dependency descriptor
```

---

## 🚀 Prerequisites & Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
*   **JDK 17 or 25** (the project is compatible with recent Java versions)
*   **Maven 3.8+**
*   **MySQL Server (v8.0+)**
*   **MariaDB Server (v11.3+)** (for the AI Vector Store) or **Docker**
*   **Ollama CLI** (running locally)

---

### Step-by-Step Setup

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/your-username/job-portal.git
    cd job-portal
    ```

2.  **Set Up Databases:**
    You need both a standard relational database (MySQL) and a vector database (MariaDB). You can use the provided Docker Compose file:
    ```bash
    docker-compose up -d
    ```
    Or manually create them in your local servers:
    ```sql
    CREATE DATABASE jobportal; /* On MySQL port 3306 */
    CREATE DATABASE vectordb;  /* On MariaDB port 3307 */
    ```

3.  **Run Ollama Local LLM:**
    Make sure Ollama is active on your machine and download the required model:
    ```bash
    ollama run llama3.2
    ```

4.  **Configure Application Properties:**
    Modify the configuration in `src/main/resources/application.properties`:
    ```properties
    # MySQL Database Configuration
    spring.datasource.url=jdbc:mysql://localhost:3306/jobportal?createDatabaseIfNotExist=true
    spring.datasource.username=root
    spring.datasource.password=Harshit@1

    # MariaDB Vector Store Configuration
    spring.vector.datasource.url=jdbc:mariadb://localhost:3307/vectordb?createDatabaseIfNotExist=true
    spring.vector.datasource.username=root
    spring.vector.datasource.password=Harshit@1
    spring.ai.vectorstore.mariadb.initialize-schema=true

    # JWT Lifespan
    jwt.secret=your_super_secret_key_at_least_32_characters_long
    jwt.expiration=86400000 # 24 hours

    # Ollama Local Server
    spring.ai.ollama.base-url=http://localhost:11434
    spring.ai.ollama.chat.model=llama3.2

    # JavaMailSender Properties (Gmail SMTP)
    spring.mail.host=smtp.gmail.com
    spring.mail.port=587
    spring.mail.username=YOUR_GMAIL_USERNAME
    spring.mail.password=YOUR_GMAIL_APP_PASSWORD
    ```

5.  **Build & Run Application:**
    Use the Maven wrapper to start the server:
    ```bash
    ./mvnw spring-boot:run
    ```
    The server will boot on port `8080`. Swagger UI will be available at `http://localhost:8080/swagger-ui.html`.

---

## 🔌 API Documentation Preview

All API endpoints are prefixed with `/api` and require a `Bearer <token>` in the `Authorization` header for protected routes.

| HTTP Method | Endpoint URL | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Registers a Candidate or Recruiter | **No** |
| `POST` | `/api/auth/login` | Log in user and returns JWT token | **No** |
| `POST` | `/api/jobs` | Publishes a new job vacancy (Recruiter) | **Yes** (Recruiter) |
| `POST` | `/api/applications/apply` | Apply to a job listing (triggers Ollama scanning) | **Yes** (Candidate) |
| `PUT` | `/api/applications/job/{id}/status` | Updates applicant status (triggers auto email) | **Yes** (Recruiter) |
| `POST` | `/api/email/send` | Dispatches customized HTML email templates | **Yes** (Recruiter) |
| `POST` | `/api/resumes/upload` | Uploads PDF resume file | **Yes** (Candidate) |

---

## 🐳 Docker Support

To run the application inside a Docker container:

1.  **Build the Jar & Docker Image:**
    ```bash
    ./mvnw package -DskipTests
    docker build -t jobportal-backend:latest .
    ```

2.  **Run the Container:**
    Make sure your databases are running and accessible (you may need to configure Docker network settings so the app can reach `localhost` services):
    ```bash
    docker run -d -p 8080:8080 --name jobportal-app jobportal-backend:latest
    ```

---

## 🧪 Running Tests

Verify service behavior and unit tests using the Maven wrapper:
```bash
# Unix/MacOS
./mvnw clean test

# Windows
mvnw.cmd clean test
```

---

## 🤝 Contributing & License

### Contributing
1. Fork this repository.
2. Create your branch (`git checkout -b feature/NewFeature`).
3. Commit your changes (`git commit -m 'Add NewFeature'`).
4. Push to the branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

### License
This project is licensed under the MIT License:

```text
MIT License

Copyright (c) 2026 Harshit Raj / Project Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
