## Changelog

> **7.0.0b15**

**Updated:**
- The following files now display better error messages
  - handler.js
  - add.js
  - push.js
  - set.js
  - subtract.js
- More information added to index.js
- Better dev testing

---

> **7.0.0b14**

**Added:**
- Added CHANGELOG.md

**Updated:**
- Updated README.md
- Updated package.json
- Adding/Subtracting/Setting `Infinity` in the database now displays an error

**Bugfixes:**
- Setting/Pushing `0` to the database no longer displays an error
- db.delete() no longer displays extra data when successful