In this document I am explaining the two main backend logics that make this project collaborative and smart:

Smart Assign — how tasks get assigned fairly.

Conflict Handling — how the app avoids overwriting someone else’s work when multiple people edit same task.

I have included some code snippets, real-world examples, and how these actually fix real teamwork problems.
Hope this helps any dev or reviewer understand what’s happening behind the scenes.

✅ 1) Smart Assign Logic
🔍 What is Smart Assign?
In a team, sometimes a manager or leader has to see who is free before assigning a task.
But if we do this manually every time, it can get slow or unfair. So, Smart Assign automates it — it finds the user who has the least active tasks and auto-assigns the new task to them.

This keeps work balanced without any manual checking.

⚙️ How it works (in backend)
We use a MongoDB aggregation pipeline to count how many tasks each user has that are Todo or In Progress.

Then, we sort the users by this count.

Pick the top user (least tasks).

Update the task to assign it to this user.

Also, log this action for our Activity Log.

Finally, use Socket.IO to broadcast the update so all other users see the new assignment instantly.

🧩 Key code snippet
Here’s a small piece of how I wrote it:


const eligibleUsers = await User.aggregate([
  {
    $lookup: {
      from: 'tasks',
      localField: '_id',
      foreignField: 'assignedUser',
      as: 'tasks'
    }
  },
  {
    $addFields: {
      taskCount: {
        $size: {
          $filter: {
            input: '$tasks',
            as: 'task',
            cond: { $in: ['$$task.status', ['Todo', 'In Progress']] }
          }
        }
      }
    }
  },
  { $sort: { taskCount: 1 } },
  { $limit: 1 }
]);



This basically joins each user with their tasks, filters out the ones that are done, counts the rest, and sorts by count.

📝 Example
Let’s say:

User Ayesha has 5 active tasks

User Raj has 3

User Tom has 1

When you click Smart Assign on a new task, the backend checks who has the least — in this case Tom. So, the task gets assigned to Tom automatically.

✅ How it solves the problem
✨ No overload: Nobody ends up with too many tasks while others have none.

⚡ Fairness: Even distribution of work, especially when team grows.

🔄 Real-time: Other users see the new assignee immediately thanks to Socket.IO.

This removes the manual burden from the leader or teammates to check every time.

✅ 2) Conflict Handling Logic
🔍 What is Conflict Handling?
When multiple people edit the same task at the same time, their changes can clash.
If there’s no protection, one person’s work might overwrite another’s.

Conflict Handling checks if a task has been changed since you last loaded it — if yes, it blocks your update and sends you both versions so you can merge them safely.

⚙️ How it works (in backend)
Every task has a lastModified timestamp.

When you update a task, your request must send the timestamp you saw.

Backend compares your timestamp with the current one in DB.

If timestamps match → no one else changed it → update is safe.

If timestamps don’t match → someone else changed it → return a 409 Conflict with both versions.




🧩 Small code piece (concept)

const existingTask = await Task.findById(id);
if (existingTask.lastModified.getTime() !== clientLastModified.getTime()) {
  return res.status(409).json({
    message: 'Conflict detected',
    serverVersion: existingTask,
    clientVersion: req.body
  });
}
// else, safe to update



📝 Example
Imagine:

Meera opens a task and edits the title at 2:00 PM.

Raj opens the same task and edits the description at 2:01 PM.

Raj saves first → lastModified becomes 2:02 PM.

Meera tries to save her change with old timestamp (2:00 PM).

Backend detects the mismatch → sends both versions back.

Frontend shows a Conflict Modal with server version & her version → Meera decides to merge or overwrite.

This way, no data is lost!

✅ How it solves the problem
💡 Prevents accidental overwrite: Two people changing same task don’t mess up each other’s work.

🛡️ Safe teamwork: Just like Google Docs, you don’t lose edits if two people edit same thing.

🧩 Clear resolution: User sees both versions and chooses how to fix it.



🔗 Real-Time + Logging
Socket.IO is used for both: Smart Assign and Conflict Handling updates are emitted to all connected clients.

ActionLog: Every time Smart Assign is used or a task is updated, it saves who did it and when. This is shown in the Activity Log panel.

