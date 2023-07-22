function tasker() {
  try {
    executeTask();
  } catch (err) {
    console.log(`Task failed.`);
    console.log(err);
  }
}

function executeTask() {
  const taskName = process.env.TASK;
  if (!taskName) {
    throw new Error('Task name is not defined.');
  }
  const task: () => void = require(`../tasks/${taskName}`).default;
  task();
}

tasker();
