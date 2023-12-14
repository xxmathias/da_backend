"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var express_session_1 = __importDefault(require("express-session"));
var dbTools_1 = require("./utils/database/dbTools");
var body_parser_1 = __importDefault(require("body-parser"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
require('dotenv').config();
var defaultProfilePicture = 'data:image/png;base64,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';
function createTables() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    console.log("Attempting to create necessary tables...");
                    return [4 /*yield*/, dbTools_1.connection.execute("\n          CREATE TABLE IF NOT EXISTS users (\n              id INTEGER AUTO_INCREMENT PRIMARY KEY,\n              username VARCHAR(256),\n              password VARCHAR(255) NOT NULL,\n              email VARCHAR(320),\n              is_admin INTEGER DEFAULT 0 NOT NULL,\n              created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n              profile_picture MEDIUMTEXT\n          );\n      ")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dbTools_1.connection.execute("\n          CREATE TABLE IF NOT EXISTS chats (\n              id INT AUTO_INCREMENT PRIMARY KEY,\n              name VARCHAR(256),\n              last_message MEDIUMTEXT,\n              created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n              last_message_sent TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n              chat_admin_id INT,\n              isRoom BOOLEAN,\n              chat_picture MEDIUMTEXT,\n              CONSTRAINT fk_chat_admin_id FOREIGN KEY (chat_admin_id) REFERENCES users(id)\n          );\n      ")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, dbTools_1.connection.execute("\n          CREATE TABLE IF NOT EXISTS messages (\n              id INTEGER AUTO_INCREMENT PRIMARY KEY,\n              user_id INTEGER NOT NULL,\n              chat_id INTEGER NOT NULL,\n              msg_type INTEGER,\n              msg MEDIUMTEXT,\n              created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n              CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id),\n              CONSTRAINT fk_chat_id FOREIGN KEY (chat_id) REFERENCES chats(id)\n          );\n      ")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, dbTools_1.connection.execute("\n          CREATE TABLE IF NOT EXISTS chat_users (\n              id INTEGER AUTO_INCREMENT PRIMARY KEY,\n              user_id INTEGER NOT NULL,\n              chat_id INTEGER NOT NULL,\n              CONSTRAINT fk_cu_user_id FOREIGN KEY (user_id) REFERENCES users(id),\n              CONSTRAINT fk_cu_chat_id FOREIGN KEY (chat_id) REFERENCES chats(id)\n          );\n      ")];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, insertUsers()];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    console.error("Error creating tables:", error_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function insertUsers() {
    return __awaiter(this, void 0, void 0, function () {
        var rows, filePath, fileData, users, user1Id, chatIds, _i, users_1, user, hashedPassword, result, userId, _a, _b, chat, chatResult, error_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 12, , 13]);
                    console.log("Checking for existing users...");
                    return [4 /*yield*/, dbTools_1.connection.query("SELECT COUNT(*) AS count FROM users")];
                case 1:
                    rows = (_c.sent())[0];
                    if (rows[0].count > 0) {
                        console.log("Users already exist\nBackend is ready ✅");
                        return [2 /*return*/];
                    }
                    filePath = path_1.default.join(__dirname, 'users.json');
                    fileData = fs_1.default.readFileSync(filePath, 'utf8');
                    users = JSON.parse(fileData);
                    user1Id = null;
                    chatIds = {};
                    _i = 0, users_1 = users;
                    _c.label = 2;
                case 2:
                    if (!(_i < users_1.length)) return [3 /*break*/, 11];
                    user = users_1[_i];
                    console.log("Inserting user: ".concat(user.username, " ..."));
                    hashedPassword = (0, dbTools_1.getHashedPassword)(user.password);
                    return [4 /*yield*/, dbTools_1.connection.execute('INSERT INTO users (username, password, email, is_admin) VALUES (?, ?, ?, ?)', [user.username, hashedPassword, user.email, user.is_admin])];
                case 3:
                    result = (_c.sent())[0];
                    userId = result.insertId;
                    if (user.username === 'user1') {
                        user1Id = userId;
                    }
                    if (!user.chats) return [3 /*break*/, 10];
                    _a = 0, _b = user.chats;
                    _c.label = 4;
                case 4:
                    if (!(_a < _b.length)) return [3 /*break*/, 10];
                    chat = _b[_a];
                    if (!!chatIds[chat.name]) return [3 /*break*/, 7];
                    console.log("Inserting chat: ".concat(chat.name, " ..."));
                    return [4 /*yield*/, dbTools_1.connection.execute('INSERT INTO chats (name, chat_admin_id, isRoom) VALUES (?, ?, 1)', [chat.name, user1Id])];
                case 5:
                    chatResult = (_c.sent())[0];
                    chatIds[chat.name] = chatResult.insertId;
                    // Insert user1 into chat_users for each chat
                    return [4 /*yield*/, dbTools_1.connection.execute('INSERT INTO chat_users (user_id, chat_id) VALUES (?, ?)', [user1Id, chatIds[chat.name]])];
                case 6:
                    // Insert user1 into chat_users for each chat
                    _c.sent();
                    _c.label = 7;
                case 7:
                    if (!(userId !== user1Id)) return [3 /*break*/, 9];
                    return [4 /*yield*/, dbTools_1.connection.execute('INSERT INTO chat_users (user_id, chat_id) VALUES (?, ?)', [userId, chatIds[chat.name]])];
                case 8:
                    _c.sent();
                    _c.label = 9;
                case 9:
                    _a++;
                    return [3 /*break*/, 4];
                case 10:
                    _i++;
                    return [3 /*break*/, 2];
                case 11:
                    console.log("Users and chats inserted successfully\n Backend setup finished & ready to go ✅");
                    return [3 /*break*/, 13];
                case 12:
                    error_2 = _c.sent();
                    console.error("Error inserting users and chats:", error_2);
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    });
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, createTables()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
var app = (0, express_1.default)();
app.set("port", process.env.PORT || 8080);
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use((0, express_session_1.default)({
    secret: 'your_secret_key_here',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: false
    },
}));
app.use(body_parser_1.default.json());
var http = require("http").Server(app);
var io = require("socket.io")(http); // set up socket.io and bind it to our http server.
app.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.send("hi");
        return [2 /*return*/];
    });
}); });
app.get("/getUserById/:userId", function (req, res) {
    var userId = req.params.userId;
    var promGetUserById = new Promise(function (resolve, reject) {
        resolve((0, dbTools_1.getUserById)(parseInt(userId)));
    });
    promGetUserById.then(function (result) {
        res.send({ result: result });
    });
});
app.get("/getMessagesByChatId/:chatId", function (req, res) {
    var chatId = req.params.chatId;
    var promGetMessagesByChatId = new Promise(function (resolve, reject) {
        resolve((0, dbTools_1.getMessagesByChatId)(parseInt(chatId)));
    });
    promGetMessagesByChatId.then(function (result) {
        res.send({ result: result });
    });
});
app.get("/getChatsByUserId/:userId", function (req, res) {
    var userId = req.params.userId;
    var promGetChatsByUserId = new Promise(function (resolve, reject) {
        resolve((0, dbTools_1.getChatsByUserId)(parseInt(userId)));
    });
    promGetChatsByUserId.then(function (result) {
        res.send({ result: result });
    });
});
app.post("/createChat", function (req, res) {
    var promCreateChat = new Promise(function (resolve, reject) {
        resolve((0, dbTools_1.createChat)(req.body.chatName, req.body.creatorId, req.body.selectedUser.length > 1));
        resolve(console.log("createChat body", req.body.selectedUser));
    });
    promCreateChat.then(function (res) {
        //@ts-ignore
        (0, dbTools_1.createChatUser)({ user: { id: req.body.creatorId }, chat_id: res.insertId });
        console.log("createChat: ", res);
        req.body.selectedUser.forEach(function (user) {
            //@ts-ignore
            (0, dbTools_1.createChatUser)({ user: user, chat_id: res.insertId });
        });
    });
});
app.post("/getUserByChatId", function (req, res) {
    var getUserPromise = new Promise(function (resolve, reject) {
        resolve((0, dbTools_1.getUsersByChatId)(req.body.chat_id, req.body.currentUserId));
    });
    getUserPromise
        .then(function (users) {
        res.json(users); // Sending the response back to the frontend as JSON
    })
        .catch(function (error) {
        // Handle any error that occurred during the getUserByChatId function
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    });
});
app.post("/deleteChat", function (req, res) {
    // NEEDS TEST
    var promCreateChat = new Promise(function (resolve, reject) {
        resolve((0, dbTools_1.deleteChat)(req.body.chatId));
    });
    promCreateChat.then(function (res) {
        console.log("deleteChat: ", res);
    });
});
app.post("/addUserToChat", function (req, res) {
    var promAddUserToChat = new Promise(function (resolve, reject) {
        resolve((0, dbTools_1.addUserToChat)(req.body.userId, req.body.chatId));
    });
    promAddUserToChat.then(function (res) {
        console.log("addUserToChat: ", res);
    });
});
app.post("/removeUserFromChat", function (req, res) {
    // NEEDS TEST
    var promAddUserToChat = new Promise(function (resolve, reject) {
        resolve((0, dbTools_1.removeUserFromChat)(req.body.userId, req.body.chatId));
    });
    promAddUserToChat.then(function (res) {
        console.log("removeUserFromChat: ", res);
    });
});
app.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, password, email, user, isMatch, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, password = _a.password, email = _a.email;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, dbTools_1.getUserByMail)(email)];
            case 2:
                user = _b.sent();
                if (!user) {
                    res.status(404).json({ message: 'User not found' });
                    return [2 /*return*/];
                }
                isMatch = (0, dbTools_1.comparePasswords)(password, user.password);
                if (!isMatch) {
                    res.status(401).json({ message: 'Invalid credentials' });
                    return [2 /*return*/];
                }
                req.session.user = user;
                res.json({ message: 'Logged in successfully!', user: user }); // valid credentials, set user in the session
                return [3 /*break*/, 4];
            case 3:
                error_3 = _b.sent();
                console.error(error_3);
                res.status(500).json({ message: 'Server error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post('/changePassword', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, oldPassword, newPassword, email, user, isOldPasswordValid, hashedNewPassword, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, oldPassword = _a.oldPassword, newPassword = _a.newPassword, email = _a.email;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, dbTools_1.getUserByMail)(email)];
            case 2:
                user = _b.sent();
                if (!user) {
                    res.status(404).send('User not found');
                    return [2 /*return*/];
                }
                isOldPasswordValid = (0, dbTools_1.comparePasswords)(oldPassword, user.password);
                if (!isOldPasswordValid) {
                    res.status(401).send('Invalid old password');
                    return [2 /*return*/];
                }
                hashedNewPassword = (0, dbTools_1.getHashedPassword)(newPassword);
                return [4 /*yield*/, dbTools_1.connection.execute('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, user.id])];
            case 3:
                _b.sent();
                res.status(200).json({ message: 'Password changed successfully' });
                return [3 /*break*/, 5];
            case 4:
                error_4 = _b.sent();
                console.error(error_4);
                res.status(500).send('Server error');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.post('/getSession', function (req, res) {
    var user = req.session.user;
    if (user) {
        res.json({ message: 'Logged in!', user: user });
    }
    else {
        res.status(401).json({ message: 'Not logged In' });
    }
});
app.post('/logout', function (req, res) {
    req.session.user = null; // set the user property to null
    req.session.destroy(function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error destroying session' });
        }
        else {
            res.clearCookie('session'); // clear the cookie from the client
            res.status(200).json({ message: 'Session destroyed', user: null });
        }
    });
});
app.post("/sendMessage", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var messages, results, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                messages = req.body;
                return [4 /*yield*/, Promise.all(messages.map(function (message) { return (0, dbTools_1.sendMessage)(message); }))];
            case 1:
                results = _a.sent();
                console.log("results:", results);
                res.status(200).json(results);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                console.error(err_1);
                res.status(500).send("Error sending messages");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post("/changeProfilePicture", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, newPicture, result_1, result, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, userId = _a.userId, newPicture = _a.newPicture;
                // Check if userId and newPicture are not undefined
                if (userId === undefined && newPicture === undefined) {
                    return [2 /*return*/, res.status(400).json({ error: 'Bad Request' })];
                }
                if (!(newPicture === null)) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, dbTools_1.changeProfilePicture)(defaultProfilePicture, userId)];
            case 1:
                result_1 = _b.sent();
                return [2 /*return*/, res.status(200).json({ message: 'Profile picture deleted' })];
            case 2: return [4 /*yield*/, (0, dbTools_1.changeProfilePicture)(newPicture, userId)];
            case 3:
                result = _b.sent();
                res.status(200).json({ message: 'Profile picture updated' });
                return [3 /*break*/, 5];
            case 4:
                error_5 = _b.sent();
                console.error(error_5);
                res.status(500).json({ error: 'Internal Server Error' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.post("/changeChatPicture", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, newPicture, result, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, userId = _a.userId, newPicture = _a.newPicture;
                // Check if userId and newPicture are not undefined
                if (userId === undefined || newPicture === undefined) {
                    return [2 /*return*/, res.status(400).json({ error: 'Bad Request' })];
                }
                return [4 /*yield*/, (0, dbTools_1.changeChatPicture)(newPicture, userId)];
            case 1:
                result = _b.sent();
                res.status(200).json({ message: 'Profile picture updated' });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _b.sent();
                console.error(error_6);
                res.status(500).json({ error: 'Internal Server Error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/getProfilePicture', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, profilePicture, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.query.userId;
                if (userId === undefined) {
                    return [2 /*return*/, res.status(400).json({ error: 'Bad Request' })];
                }
                return [4 /*yield*/, (0, dbTools_1.getProfilePicture)(userId)];
            case 1:
                profilePicture = _a.sent();
                if (!(profilePicture[0].profile_picture == null)) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, dbTools_1.changeProfilePicture)(defaultProfilePicture, userId)];
            case 2:
                result = _a.sent();
                return [2 /*return*/, res.status(201).send('Cannot get profile_picture, profilepicture set to default')];
            case 3:
                if (profilePicture) {
                    return [2 /*return*/, res.status(200).send({ image: profilePicture })];
                }
                else {
                    return [2 /*return*/, res.status(404).send('Cannot get profile_picture')];
                }
                return [2 /*return*/];
        }
    });
}); });
app.get("/getMatchingUser/:inputString", function (req, res) {
    // will have to send chatId in request
    var inputString = req.params.inputString;
    // if(!inputString) return null
    var promGetMessagesByChatId = new Promise(function (resolve, reject) {
        resolve((0, dbTools_1.getMatchingUser)(inputString));
    });
    promGetMessagesByChatId.then(function (result) {
        res.send({ result: result });
    });
});
io.on("connection", function (socket) {
    var _this = this;
    // join a chat room when the client sends a 'join_room' event
    socket.on('join_room', function (roomId) {
        socket.join(roomId);
    });
    socket.on("send_message", function (arg) { return __awaiter(_this, void 0, void 0, function () {
        var newMessage, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, dbTools_1.sendMessage)(arg)];
                case 1:
                    newMessage = _a.sent();
                    // emit the new message to all sockets in the room
                    io.to(arg.chat_id).emit("new_message", newMessage);
                    return [3 /*break*/, 3];
                case 2:
                    error_7 = _a.sent();
                    console.error(error_7);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
});
io.on("User", function (socket) {
    console.log("User Online");
});
var server = http.listen(8080, function () {
    console.log("listening on *:8080");
});
// TO HASH ALL PASSWORDS IN DB
/*   const hashAllPasswords = async () => {
    try {
      // Get all users
      const [users] = await connection.execute('SELECT * FROM users');
    
      for (let user of users) {
        // Ignore users without a password
        if (!user.password) {
          console.warn(`User with id ${user.id} does not have a password set.`);
          continue;
        }
        
        // Hash each user's password
        const hashedPassword = getHashedPassword(user.password);
        
        // Update the user's password in the database
        await connection.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);
      }
  
      console.log('Passwords updated successfully');
    } catch (error) {
      console.error('Failed to hash passwords', error);
    }
  };
  hashAllPasswords(); */ 
//# sourceMappingURL=index.js.map