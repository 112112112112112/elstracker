const db = require(`./database.js`);

const tasks = [
    // * Daily + Account
    { title: `Battle Pass Daily`, reset: `daily`, bound: `account`, icon: `battlepass.png`},
    { title: `Serpentium Daily`, reset: `daily`, bound: `account`, icon: `serpdaily.webp`},

    // * Daily + Character
    { title: `Heroic Dungeon`, reset: `daily`, bound: `character`, icon: `heroic.webp`},
    { title: `Aqua Whistle`, reset: `daily`, bound: `character`, icon: `aquawhistle.webp`},

    // * Weekly + Account
    { title: `ED Weekly Mission`, reset: `weekly`, bound: `account`, icon: `ed.webp`},
    { title: `Battle Pass Weekly`, reset: `weekly`, bound: `account`, icon: `battlepass.png`},
    { title: `Enhancement Quest`, reset: `weekly`, bound: `account`, icon: `enhancement.png`},
    { title: `Secret Dungeon`, reset: `weekly`, bound: `account`, icon: `secretdungeon.webp`},
    { title: `Blacksmith Craft`, reset: `weekly`, bound: `account`, icon: `blacksmith.png`},
    { title: `Dragon Lens Craft`, reset: `weekly`, bound: `account`, icon: `lenscraft.png`},
    { title: `Serpentium Weekly`, reset: `weekly`, bound: `account`, icon: `serpdaily.webp`},

    // * Weekly + Character
    { title: `Henir`, reset: `weekly`, bound: `character`, icon: `henir.webp`},
    { title: `Abyss`, reset: `weekly`, bound: `character`, icon: `abyss.webp`},
    { title: `Serpentium`, reset: `weekly`, bound: `character`, icon: `serpentiumraid.webp`},
    { title: `Doom Aporia`, reset: `weekly`, bound: `character`, icon: `doom.webp`},
    { title: `Challenge Mode`, reset: `weekly`, bound: `character`, icon: ``},
    { title: `x10 Spirit Lord's Temple`, reset: `weekly`, bound: `character`, icon: `atma.webp`},
    { title: `Mirror Del`, reset: `weekly`, bound: `character`, icon: `mirrordel.webp`},
    { title: `Devil of Chaos`, reset: `weekly`, bound: `character`, icon: `devilofchaos.webp`},
    { title: `High Entropy`, reset: `weekly`, bound: `character`, icon: `highentropy.webp`},
];

for (const task of tasks) {
    if (!task.title) continue;

    const taskExists = db.prepare('SELECT * FROM tasks WHERE title = ?').get(task.title);
    
    if (!taskExists) {
        db.prepare('INSERT INTO tasks(title, reset, bound, system, icon) VALUES (?, ?, ?, ?, ?)').run(task.title, task.reset, task.bound, 1, task.icon);
    }
}
