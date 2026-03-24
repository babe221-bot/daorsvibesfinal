---
phase: 0-emergency-response
plan: 01
type: execute
wave: 0
autonomous: true
requirements: []
---

<objective>
Emergency response: Diagnose and fix all critical issues preventing the application from running.
Purpose: Get both the Next.js frontend and Go backend API running properly.
Output: Working development environment with both servers operational.
</objective>

<context>
Emergency diagnosis from logs:
- server.log: Go API cannot connect to PostgreSQL (port 5432 refused)
- current_dev.log: Next.js dev server port 3000 occupied by PID 46820
- dev.log: Google AI rate limiting (429), missing Next.js files
- fixing.md: Known issues with dependencies, video assets, Firebase config
</context>

<tasks>

<task type="auto">
  <name>Task 1: Kill duplicate Next.js process</name>
  <files></files>
  <action>Check if PID 46820 is still running and kill it to free port 3000. Use taskkill /PID 46820 /F on Windows.</action>
  <verify>
    <automated>netstat -ano | findstr :3000 | findstr LISTENING</automated>
  </verify>
  <done>Port 3000 is free or only occupied by our new server.</done>
</task>

<task type="auto">
  <name>Task 2: Check PostgreSQL status and start if needed</name>
  <files></files>
  <action>Check if PostgreSQL is installed and running. Try pg_isready or check Windows services. If not running, attempt to start it or document the issue.</action>
  <verify>
    <automated>pg_isready -h localhost -p 5432</automated>
  </verify>
  <done>PostgreSQL is running on port 5432 or issue is documented.</done>
</task>

<task type="auto">
  <name>Task 3: Verify Go API builds successfully</name>
  <files>cmd/api/main.go, internal/**/*.go</files>
  <action>Run go build ./cmd/api to verify the Go backend compiles without errors.</action>
  <verify>
    <automated>go build ./cmd/api</automated>
  </verify>
  <done>Go API compiles successfully.</done>
</task>

<task type="auto">
  <name>Task 4: Check and fix Next.js dependencies</name>
  <files>package.json</files>
  <action>Check if node_modules exists and npm install was run. Run npm install if needed to fix missing dependencies like action-utils.js.</action>
  <verify>
    <automated>npm ls --depth=0 2>&1 | head -5</automated>
  </verify>
  <done>Next.js dependencies are installed and working.</done>
</task>

<task type="auto">
  <name>Task 5: Start Next.js dev server on port 3000</name>
  <files></files>
  <action>Start the Next.js development server using npm run dev. Check if it starts successfully on port 3000.</action>
  <verify>
    <automated>curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "Server not yet responding"</automated>
  </verify>
  <done>Next.js dev server is running and responding on port 3000.</done>
</task>

</tasks>

<verification>
Both Next.js frontend and Go backend API are running and accessible.
</verification>

<success_criteria>
- Port 3000 is free for Next.js
- PostgreSQL is running (or issue documented)
- Go API compiles without errors
- Next.js dev server starts successfully
- Application is accessible at http://localhost:3000
</success_criteria>

<output>
Create `.planning/phases/0-emergency-response/0-01-SUMMARY.md`
</output>
