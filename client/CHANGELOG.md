# Changelog

All notable changes to the Elevare application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-09-24

### Added
- Initial release of the Elevare application.
- Core task management functionality allowing users to focus on one task per day.
- Authentication system using NextAuth.js with support for multiple providers.
- User dashboard with task creation, completion, and management.
- Streak tracking to encourage daily task completion.
- Reflection system.
- Responsive UI design optimized for all device sizes.
- Database schema for users, tasks, reflections, streaks, and achievements.
- API endpoints for all core functionality with proper validation.
- Prisma ORM setup for database interactions.
- Comprehensive documentation for the API and components.

### Changed
- N/A

### Deprecated
- N/A

### Removed
- N/A

### Fixed
- N/A

### Security
- Implemented secure authentication flows
- Added input validation and sanitization
- Used parameterized queries through Prisma to prevent injection attacks