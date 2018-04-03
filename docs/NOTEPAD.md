### Community Notepad

*Please add suggestions, what you are working on, etc.*

---

#### lieuwe_berg
A way to use { target } in db.delete:
1. `db.set('example', { name: 'lieuwe', id: '1234' })`
2. `db.fetch('example') ` { name: 'lieuwe', id: '1234' }
3. `db.delete('example', { target: '.id' })`
4. `db.fetch('example')` { name: 'lieuwe' }
Note how id got deleted, and not the entire 'example'.
