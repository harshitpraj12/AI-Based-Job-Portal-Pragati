# ==============================================================================
# Multi-Stage Dockerfile for AI-Based Job Portal (Spring Boot 3.3.4, Java 17)
# Stage 1: Build & Package with Maven
# Stage 2: Minimal, Non-Root Runtime with Eclipse Temurin 17 JRE Alpine
# ==============================================================================

# ------------------------------------------------------------------------------
# 1. BUILD STAGE
# ------------------------------------------------------------------------------
FROM maven:3.9.9-eclipse-temurin-17-alpine AS builder

WORKDIR /build

# Copy Maven project descriptor
COPY pom.xml .

# Pre-fetch dependencies in a cached layer to accelerate subsequent rebuilds
RUN mvn dependency:go-offline -B || true

# Copy application source code
COPY src ./src

# Build production jar skipping test phase (tests require running DB & Ollama)
RUN mvn clean package -DskipTests

# Extract Spring Boot 3 layers for optimal Docker caching and minimal runtime footprint
RUN java -Djarmode=tools -jar target/job-portal.jar extract --layers --launcher --destination target/extracted

# ------------------------------------------------------------------------------
# 2. RUNTIME STAGE
# ------------------------------------------------------------------------------
FROM eclipse-temurin:17-jre-alpine AS runtime

# Metadata labels
LABEL maintainer="harshitpraj12"
LABEL description="Production runtime image for AI-Based Job Portal"

# Install curl for container health check and tzdata for timezone management
RUN apk add --no-cache curl tzdata

# Security: Create dedicated unprivileged system user and group
RUN addgroup -S -g 1001 appgroup && \
    adduser -S -u 1001 -G appgroup appuser

WORKDIR /app

# Create application uploads directory and grant ownership to non-root user
RUN mkdir -p /app/uploads && \
    chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser:appgroup

# Copy extracted application layers from builder stage with correct permissions
COPY --from=builder --chown=appuser:appgroup /build/target/extracted/dependencies/ ./
COPY --from=builder --chown=appuser:appgroup /build/target/extracted/spring-boot-loader/ ./
COPY --from=builder --chown=appuser:appgroup /build/target/extracted/snapshot-dependencies/ ./
COPY --from=builder --chown=appuser:appgroup /build/target/extracted/application/ ./

# Expose Spring Boot default HTTP port
EXPOSE 8080

# Configure JVM flags optimized for container environments (cgroups v1/v2 memory limits)
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError"

# Container Healthcheck targeting public /api/jobs endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/api/jobs || exit 1

# Launch the application using Spring Boot 3 JarLauncher
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS org.springframework.boot.loader.launch.JarLauncher"]