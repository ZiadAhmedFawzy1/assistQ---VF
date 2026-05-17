# AssistQ (Queue Management System)

AssistQ is a real-time queue management and internal communication system designed to improve workflow organization between agents, monitors, and supervisors in high-volume support environments.

The system was built to reduce communication overlap, improve coordination, and streamline internal requests using a structured FIFO (First In, First Out) workflow.

---

# ⚠️ Important Notice

> [!WARNING]
> This repository is a **demonstration version only** and does not represent the full production environment.  
>  
> The original system is actively used in real operational environments and contains sensitive workflow data and internal business logic.  
>  
> For security and privacy reasons, some modules, configurations, and production features have been removed or modified.

---

# Features

- FIFO-Based Queue Management System
- Role-Based Access Control (Agent / Monitor / Wizard)
- Real-Time Communication System
- Request Priority Handling
- Request Status Tracking (Pending / In Progress / Solved)
- Internal Workflow Notifications
- Supervisor (Wizard) Resolution System
- Agent Confirmation Workflow
- Socket.IO Real-Time Updates

---

# System Roles

## Agent
Responsible for creating support requests with details such as reason, priority, and additional information.

## Monitor
Observes system activity and tracks request flow and status updates.

## Wizard
Supervises the system, reviews incoming requests, and marks them as solved after resolution.

---

# Workflow Overview

1. Agent submits a request with:
   - Reason
   - Priority
   - Details
2. Requests enter a FIFO queue
3. Wizard reviews and processes requests
4. Requests are marked as solved
5. Agent confirms resolution to close the request

---

# Tech Stack

## Frontend
- React.js

## Backend
- Node.js
- Express.js

## Real-Time Communication
- Socket.IO

## Database
- MongoDB

## Authentication & Security
- JWT Authentication

---

# Problem Statement

In high-volume support environments, multiple agents handle customer inquiries simultaneously, leading to:
- Communication overlap
- Duplicate responses
- Lack of coordination
- Delayed request handling

---

# Solution

Developed a FIFO-based real-time queue management system to structure internal communication between agents, monitors, and supervisors, ensuring organized and efficient request handling.

---

# Benefits

- Improved internal communication flow
- Reduced duplicate and overlapping requests
- Increased operational efficiency
- Real-time coordination between roles
- Better request tracking and accountability

---

# Demo Credentials

> ⚠️ All accounts use the same test password: `test`

## Agent Account
- Username: `ziadfawzy`
- Password: `test`
- Role: Agent

## Wizard Account
- Username: `fouly`
- Password: `test`
- Role: Wizard

## Monitor Account
- Username: `maged`
- Password: `test`
- Role: Monitor

---

# Project Goals

- Organize internal support workflow efficiently
- Implement real-time queue system
- Reduce communication confusion between agents
- Improve task tracking and accountability
- Enhance operational performance in high-load environments

---

# Developer

Ziad Fawzy  
Full-Stack Software Engineer (MERN Stack Developer)
