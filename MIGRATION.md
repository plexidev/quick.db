# Quick.db v5.x Migration Guide

| Old Syntax | New Syntax |
| ------ | ------ |
|.updateValue(ID, number) | .add(ID, number) & .subtract(ID, number) |
|.updateText(ID, text) | .set(ID, **data**) |
|.fetchObject(ID) | .fetch(ID) |
| --- | .push(ID, **data**) |
| --- | .delete(ID) |

**Data:** You can supply it any type, objects/numbers/text/arrays/etc., **they will all work.**

**Quick.db v5.x coems with even more features, you can learn about the documentation [here](https://www.npmjs.com/package/quick.db)!**
