const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function seed() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  // Clear existing tasks and projects for a fresh seed
  await db.exec('DELETE FROM tasks');
  await db.exec('DELETE FROM projects');
  await db.exec('DELETE FROM users WHERE email="demo@example.com"'); // just in case

  // Re-insert projects
  await db.exec(`
    INSERT INTO projects (name, description) VALUES 
    ('Website Redesign', 'Overhaul the company website with modern glassmorphism UI'),
    ('Q3 Marketing Campaign', 'Plan and execute the marketing campaign for Q3'),
    ('Backend Refactoring', 'Migrate the legacy monolith to microservices');
  `);

  // Generate some dates
  const today = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today); nextWeek.setDate(nextWeek.getDate() + 7);
  const overdue = new Date(today); overdue.setDate(overdue.getDate() - 2);
  const nextMonth = new Date(today); nextMonth.setDate(nextMonth.getDate() + 30);

  // We assume user with ID 1 (Admin) and 2 (Member) exist. Let's make sure they do, or use existing IDs.
  // We'll just insert tasks with assignedTo = 1 or 2.
  await db.exec(`
    INSERT INTO tasks (title, description, status, projectId, assignedTo, dueDate, createdBy) VALUES
    ('Design Figma Mockups', 'Create UI/UX designs for the new homepage', 'Completed', 1, 1, '${today.toISOString()}', 1),
    ('Implement React Frontend', 'Convert Figma designs to React components', 'In Progress', 1, 1, '${tomorrow.toISOString()}', 1),
    ('Social Media Assets', 'Design banners and images for Twitter and LinkedIn', 'Pending', 2, 1, '${nextWeek.toISOString()}', 1),
    ('Draft Newsletter', 'Write the copy for the Q3 announcement', 'Overdue', 2, 2, '${overdue.toISOString()}', 1),
    ('Database Schema Update', 'Update the SQLite schema to support task attachments', 'Pending', 3, 2, '${tomorrow.toISOString()}', 1),
    ('API Optimization', 'Optimize the /api/dashboard query for performance', 'In Progress', 3, 1, '${nextWeek.toISOString()}', 1),
    ('Write Unit Tests', 'Ensure 80% test coverage for all backend endpoints', 'Pending', 3, 2, '${tomorrow.toISOString()}', 1),
    ('Client Presentation', 'Prepare slides for the final website review', 'Completed', 1, 2, '${today.toISOString()}', 1),
    ('Setup CI/CD Pipeline', 'Automate GitHub Actions deployment to Vercel', 'In Progress', 3, 1, '${tomorrow.toISOString()}', 1),
    ('Budget Approval', 'Review and approve the budget for ad spending', 'Pending', 2, 1, '${nextMonth.toISOString()}', 1);
  `);
  console.log("Successfully seeded exactly 10 tasks and 3 projects!");
}

seed();
