# 📝 Project Logic — Smart Assign & Conflict Handling

Hey team! 👋
This doc explains the **two main backend logics** that make this app work smooth in a team:

* ✅ **Smart Assign** — how tasks get auto-assigned fairly
* ✅ **Conflict Handling** — how we avoid overwriting each other’s changes

I’ve put small code bits, examples, and why these actually fix real teamwork issues. Hope this helps anyone reading the code understand what’s happening behind the scenes.

---

## ✅ 1) Smart Assign

### 🔍 What’s Smart Assign?

Normally when assigning tasks, a lead or manager checks who’s free or overloaded. Doing this every time is boring and can be unfair sometimes. So **Smart Assign** does it for us. It checks who has the **least active tasks** and auto-assigns the new task to them.

So the work stays balanced — nobody’s drowning in work while others chill.

---

### ⚙️ How it works (backend)

* We use a **MongoDB aggregation pipeline** to count how many tasks each user has that are `Todo` or `In Progress`.
* Sort users by this count.
* Pick the top user with the least tasks.
* Update the task to assign it to them.
* Log this in our **Activity Log** for tracking.
* Use **Socket.IO** to broadcast the update → so everyone sees the new assignee instantly.

---

### 🧩 Code snippet

```js
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
```

Basically, it joins each user with their tasks, filters out completed ones, counts the rest, and picks the one with the least.

---

### 📝 Example

* Ayesha: 5 active tasks
* Raj: 3
* Tom: 1

If you click **Smart Assign**, it picks Tom. Easy!

---

### ✅ Why it’s good

* Nobody gets overloaded.
* Fair work distribution.
* Updates happen in real-time for everyone.

---

## ✅ 2) Conflict Handling

### 🔍 What’s Conflict Handling?

When two people edit the **same task** at the same time, they can overwrite each other. That sucks.

**Conflict Handling** checks if a task has changed since you last opened it. If yes → it blocks your update and shows both versions, so you can safely merge.

---

### ⚙️ How it works (backend)

* Every task has a `lastModified` timestamp.
* When you update, your request sends the timestamp you saw.
* Backend compares this with the DB.

  * If timestamps match → safe, update goes through.
  * If timestamps don’t match → someone else changed it → we send back a **409 Conflict** with both versions.

---

### 🧩 Small code piece

```js
const existingTask = await Task.findById(id);

if (existingTask.lastModified.getTime() !== clientLastModified.getTime()) {
  return res.status(409).json({
    message: 'Conflict detected',
    serverVersion: existingTask,
    clientVersion: req.body
  });
}
// else, safe to update
```

---

### 📝 Example

* Meera opens task at 2:00 PM.
* Raj opens same task at 2:01 PM.
* Raj saves first → `lastModified` now 2:02 PM.
* Meera tries to save with old timestamp → backend blocks it & shows both versions.
* She can merge or choose what to keep.

No one loses their work!

---

### ✅ Why it’s good

* Stops people from accidentally overwriting each other.
* Teamwork stays safe, like Google Docs.
* Users can see & fix conflicts clearly.

---

## 🔗 Real-time & Logging

Both logics use **Socket.IO** → so updates are pushed live to all clients.
Also, every action gets logged (who did what, when) in the **Activity Log**, so you can always see what happened.

---

