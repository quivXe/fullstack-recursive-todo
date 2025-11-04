# TODO APP IN VUE AND NODE

TODO app with infinite recursion (you can go into the task again and again for better organization).

Option for creating `collabs` *(may not work because of free hosting provider for cashing - needs refreshing)*. With collabs you can work on the same tasks with anyone. And all that without creating account.

available on: https://todo-app.alwaysdata.net/ *(again - may not work cuz of free hosting - especially collabs because of cashing)*


## How it works?
App is splitted into two categories: local and collab. 

Local version is simply saved in localStorage and recursion is done simply with parentId.

Collab version is also saved in localStorage and if someone joins collaboration, at least 1 person with newest version must be online, so tasks can be shared to new user. After first sync, updates are done with Pusher (which is something like WebSockets) - for example when someone moves task, move event is triggered and every subscriber updates current version.

To prevent the need to have an online user everytime someone with outdated tasks joins, database is used - every operation is stored with date. User then checks his last updated operation date and sends it to the server. Server then have 3 options:
- date is not in database: version is very old and been already deleted - user must get whole tasks array from online user
- date is in database but its not first: every operation is sent to the user and he goes through it updating its tasks
- date is in databse and its first: version is up to date, nothing to be done

Using: VUE 3, Node.js, Pusher (ala websockets), SASS, cashing system (free redis alternative)


*quick view*
<img width="1920" height="1030" alt="image" src="https://github.com/user-attachments/assets/f3c413ac-d88a-443a-b585-fb785e281c7d" />
<img width="1920" height="1030" alt="image" src="https://github.com/user-attachments/assets/978f0aeb-8e07-4eb2-9925-4423dea00a30" />


# server API

## COLLABORATIONS

### /api/collaborations/create

#### REQUEST

- headers: `{ 'Content-Type': 'application/json' }`
- body: `{ name, password }`

#### RESPONSE

- 201: `{ name: createdCollabName }`
- 400: `{ error: 'A collaboration with this name already exists' }`
- 422:
  - `{ error: 'Invalid characters in name. Only letters, numbers, and _ - = @ , . ; are allowed' }`
  - `{ error: 'Name length cannot be longer than 156' }`

### /api/collaborations/join

#### REQUEST

- headers: `{ 'Content-Type': 'application/json' }`
- body: `{ name, password }`

#### RESPONSE

- 201: `{ name: collabName }`
- 400: `{ error: 'Collaboration not found or password incorrect' }`

## OPERATIONS

### /api/operations/log

#### REQUEST

headers: `{ 'Content-Type': 'application/json' }`
body: `{ collabId, operationType, details, operationIndex, operation_part, operation_max_part }`

#### RESPONSE

- 200: `{ collabId,operationType, details, operationIndex, operation_part, operation_max_part }`

### /api/operations/get

#### REQUEST

headers: `{'Content-Type': 'application/json' }`
body: `{ collabId, operationIndex }`

#### RESPONSE

- 201: Array of operations from given collabId starting from `operationIndex+1`

*All unhandled errors has status code 5xx*

```
todo-app-vue
├─ .git
│  ├─ COMMIT_EDITMSG
│  ├─ config
│  ├─ description
│  ├─ gitk.cache
│  ├─ HEAD
│  ├─ hooks
│  │  ├─ applypatch-msg.sample
│  │  ├─ commit-msg.sample
│  │  ├─ fsmonitor-watchman.sample
│  │  ├─ post-update.sample
│  │  ├─ pre-applypatch.sample
│  │  ├─ pre-commit.sample
│  │  ├─ pre-merge-commit.sample
│  │  ├─ pre-push.sample
│  │  ├─ pre-rebase.sample
│  │  ├─ pre-receive.sample
│  │  ├─ prepare-commit-msg.sample
│  │  ├─ push-to-checkout.sample
│  │  └─ update.sample
│  ├─ index
│  ├─ info
│  │  ├─ exclude
│  │  └─ refs
│  ├─ objects
│  │  ├─ info
│  │  │  └─ packs
│  │  └─ pack
│  │     ├─ pack-a4dd9643eaf3dcb46be0bb8b8b1c679f55b8f506.idx
│  │     └─ pack-a4dd9643eaf3dcb46be0bb8b8b1c679f55b8f506.pack
│  ├─ ORIG_HEAD
│  ├─ packed-refs
│  └─ refs
│     ├─ heads
│     │  └─ main
│     ├─ remotes
│     │  └─ origin
│     │     └─ main
│     └─ tags
├─ .gitignore
├─ client
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  └─ favicon.ico
│  ├─ src
│  │  ├─ App.vue
│  │  ├─ assets
│  │  │  ├─ images
│  │  │  │  ├─ edit.svg
│  │  │  │  ├─ join1.svg
│  │  │  │  ├─ join2.svg
│  │  │  │  ├─ local_tasks.svg
│  │  │  │  ├─ logo.svg
│  │  │  │  ├─ more.svg
│  │  │  │  ├─ shared_tasks.svg
│  │  │  │  └─ show.svg
│  │  │  ├─ javascript
│  │  │  └─ styles
│  │  │     ├─ main.css
│  │  │     └─ _common.sass
│  │  ├─ components
│  │  │  └─ todoTasks
│  │  │     ├─ AddTaskButton.vue
│  │  │     ├─ Column.vue
│  │  │     ├─ description
│  │  │     │  ├─ Description.vue
│  │  │     │  └─ ShowDescriptionButton.vue
│  │  │     ├─ index.js
│  │  │     ├─ nav
│  │  │     │  ├─ BackButton.vue
│  │  │     │  └─ ParentTree.vue
│  │  │     ├─ Options.vue
│  │  │     └─ Task.vue
│  │  ├─ main.js
│  │  ├─ router
│  │  │  ├─ guards.js
│  │  │  ├─ index.js
│  │  │  └─ routes.js
│  │  ├─ services
│  │  │  ├─ IndexedDBManager.js
│  │  │  ├─ TaskManager.js
│  │  │  └─ UIManager.js
│  │  ├─ store
│  │  └─ views
│  │     ├─ Collaborations.vue
│  │     ├─ JoinCollaboration.vue
│  │     ├─ NotFound.vue
│  │     ├─ ShareTask.vue
│  │     └─ Tasks.vue
│  └─ vite.config.js
├─ package-lock.json
├─ README.md
└─ server
   ├─ app.js
   ├─ config
   │  └─ db.js
   ├─ controllers
   │  ├─ collaborationController.js
   │  └─ operationController.js
   ├─ middlewares
   │  └─ rateLimiter.js
   ├─ models
   │  ├─ Collaboration.js
   │  ├─ index.js
   │  └─ Operation.js
   ├─ package-lock.json
   ├─ package.json
   ├─ routes
   │  ├─ collaborationRoutes.js
   │  └─ operationRoutes.js
   ├─ server.js
   ├─ services
   └─ utils
      └─ hashUtils.js

```
