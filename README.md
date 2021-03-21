## Telegram-Gomoku
[Gomoku](https://en.wikipedia.org/wiki/Gomoku "Gomoku"), also known as "Connect-5" or "Five in a row", is a traditional two-player strategy board game. This is the web client for a simple online version of gomoku we made for the Telegram instant messenger. It was our first web project and our first finished game that took longer than a day to build, so we are rather proud. 🥳

### Tools used
- Client built on HTML, CSS and TypeScript;
- Server-side code (private) was written on TypeScript and runs on NodeJS;
- Files and game data are stored on Firebase;
- Some of the bot settings for the API have been edited directly on the Telegram app.

### Features
- Play realtime against any Telegram contact;
- Stop and resume play at any time (matches are stored in our database for a while);
- Spectate an ongoing match between contacts in your group chat.

### How to Play
- On Telegram, search for KiteGamesBot, or [click here](https://t.me/KiteGamesBot "click here") to be directed;
- Send a `/start` command to the bot;
- Add the bot to a group chat with the people you want to play with (don't worry, the bot will not read any messages that are not replies or not sent directly to it);
- Use the `/gomoku` or `/gomoku@KiteGamesBot` command in the group chat;
- Have both you and your friend click "Play Gomoku" to start playing;
- When it is your turn, touch a point on the board where you wish to place your stone. When you're certain about it, press the "Your Turn!" button to place it and send the move to your opponent;
- The first to make a line of 5 same-colored stones wins.