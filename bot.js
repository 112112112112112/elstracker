require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const express = require('express');
const axios = require('axios');
const app = express();
const path = require('path');
const appData = process.env.APPDATA
const dbPath = path.join(appData, 'elstracker', 'elstracker.db');
const db = require('better-sqlite3')(dbPath);
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

app.get('/dailies-status', (req, res) => {
    try {
        const charId = 0; // * account dailies
        
        const tasks = db.prepare(`
            SELECT t.id, t.title, COALESCE(c.completed, 0) as completed 
            FROM tasks t 
            LEFT JOIN checklist c ON c.task_id = t.id AND c.character_id = ?
            WHERE t.bound = 'account'
        `).all(charId);
        
        const completed = tasks.filter(t => t.completed === 1).map(t => t.title);
        const notCompleted = tasks.filter(t => t.completed === 0).map(t => t.title);

        res.json({ 
            completed: completed,
            notCompleted: notCompleted,
            total: tasks.length
        });
    } catch (error) {
        console.error('error: ', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/bot-send', async (req, res) => {
    const { message } = req.body;
    
    try {
        const channel = client.channels.cache.get(CHANNEL_ID);
        if (channel) {
            await channel.send(message);
            console.log('✅ Message sent to Discord:', message);
            res.json({ success: true });
        } else {
            console.error('❌ Channel not found:', CHANNEL_ID);
            res.status(404).json({ error: 'Channel not found' });
        }
    } catch (error) {
        console.error('❌ Error sending message:', error);
        res.status(500).json({ error: error.message });
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'dailies') {
        await interaction.reply({ content: 'Checking dailies...', ephemeral: true});
        
        try {
            const response = await axios.get('http://localhost:3001/dailies-status');
            const { completed, notCompleted } = response.data;
            
            let reply = '';
            
            if (completed.length === 0 && notCompleted.length === 0) {
                reply = 'No tasks found.';
            } else if (notCompleted.length === 0) {
                reply = 'All dailies completed!';
            } else {
                reply = `❌ **Not completed** (${notCompleted.length}):\n${notCompleted.join('\n')}`;
                
                if (completed.length > 0) {
                    reply += `\n\n✅ **Completed** (${completed.length}):\n${completed.join('\n')}`;
                }
            }
            
            await interaction.editReply(reply);
        } catch (error) {
            console.error('Bot error:', error.message);
            await interaction.editReply('There was an error checking dailies.');
        }
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Webhook URL: ${WEBHOOK_URL}`);
});

const commands = [
    {
        name: 'dailies',
        description: 'Check if all account dailies are completed'
    }
];

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

(async () => {
    try {
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
        console.log('Slash commands registered!');

    } catch (error) {
        console.error('Error: ', error);
    }
})();

client.login(BOT_TOKEN);