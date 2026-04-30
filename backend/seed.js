const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function seed() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  // Check if projects already exist
  const existingProjects = await db.all('SELECT * FROM projects');
  if (existingProjects.length === 0) {
    await db.exec(`
      INSERT INTO projects (name, description) VALUES 
      ('Website Redesign', 'Overhaul the company website with modern glassmorphism UI'),
      ('Q3 Marketing Campaign', 'Plan and execute the marketing campaign for Q3'),
      ('Backend Refactoring', 'Migrate the legacy monolith to microservices');
    `);
  }

  // Check if tasks already exist
  const existingTasks = await db.all('SELECT * FROM tasks');
  if (existingTasks.length === 0) {
    // Generate some dates
    const today = new Date();
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today); nextWeek.setDate(nextWeek.getDate() + 7);
    const overdue = new Date(today); overdue.setDate(overdue.getDate() - 2);

    await db.exec(`
      INSERT INTO tasks (title, description, status, projectId, assignedTo, dueDate, createdBy) VALUES
      ('Design Figma Mockups', 'Create UI/UX designs for the new homepage', 'Completed', 1, 1, '${today.toISOString()}', 2),
      ('Implement React Frontend', 'Convert Figma designs to React components', 'In Progress', 1, 1, '${tomorrow.toISOString()}', 2),
      ('Social Media Assets', 'Design banners and images for Twitter and LinkedIn', 'Pending', 2, 1, '${nextWeek.toISOString()}', 2),
      ('Draft Newsletter', 'Write the copy for the Q3 announcement', 'Overdue', 2, 2, '${overdue.toISOString()}', 2),
      ('Database Schema Update', 'Update the SQLite schema to support task attachments', 'Pending', 3, 2, '${tomorrow.toISOString()}', 2),
      ('API Optimization', 'Optimize the /api/dashboard query for performance', 'In Progress', 3, 1, '${nextWeek.toISOString()}', 2);
    `);
    console.log("Successfully added sample projects and tasks!");
  } else {
    console.log("Tasks already exist. Skipping seed.");
  }
}

seed();
