"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.getAllMessagesForChat = exports.getChatUsersForChat = exports.getAllMessagesForUser = exports.getMessageById = exports.sendMessage = exports.getAllChats = exports.getChatsByUserId = exports.getChatById = exports.removeUserFromChat = exports.addUserToChat = exports.deleteChat = exports.getProfilePicture = exports.changeChatPicture = exports.changeProfilePicture = exports.createChat = exports.createChatUser = exports.getMatchingUser = exports.getMessagesByChatId = exports.getUserByMail = exports.getUserById = exports.getUsersByChatId = exports.getUsers = exports.createUser = exports.comparePasswords = exports.getHashedPassword = exports.validatePassword = exports.validateCredentials = exports.connection = void 0;
require('dotenv').config();
var mysql2_1 = __importDefault(require("mysql2"));
var crypto_1 = require("crypto");
exports.connection = mysql2_1.default.createPool({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    database: "viktig",
}).promise();
var validateCredentials = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.connection.query("SELECT password from users WHERE email = ? AND password = ?", [user.email, user.password])];
            case 1:
                result = (_a.sent())[0];
                return [2 /*return*/, result[0] ? true : false];
        }
    });
}); };
exports.validateCredentials = validateCredentials;
var validatePassword = function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
    var rows, hashedPassword, match, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, exports.connection.execute('SELECT email, password FROM users WHERE email = ?', [email])];
            case 1:
                rows = (_a.sent())[0];
                if (!(rows.length > 0)) return [3 /*break*/, 3];
                hashedPassword = rows[0].password;
                console.log("Plain Password:", password, "Hashed Password:", hashedPassword);
                return [4 /*yield*/, (0, exports.comparePasswords)(password, hashedPassword)];
            case 2:
                match = _a.sent();
                console.log("Match Result:", match);
                return [2 /*return*/, match];
            case 3:
                console.error("No users found with that email.");
                return [2 /*return*/, false];
            case 4:
                error_1 = _a.sent();
                console.error(error_1);
                throw new Error('Failed to validate password');
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.validatePassword = validatePassword;
var getHashedPassword = function (password) {
    var salt = (0, crypto_1.randomBytes)(16).toString("hex");
    var hashedPassword = (0, crypto_1.scryptSync)(password, salt, 32).toString("hex");
    return "".concat(hashedPassword).concat(salt);
};
exports.getHashedPassword = getHashedPassword;
var comparePasswords = function (inputPassword, hashedPasswordWithSalt) {
    var salt = hashedPasswordWithSalt.slice(-32);
    var hashedPassword = hashedPasswordWithSalt.slice(0, -32);
    var hashedInputPassword = (0, crypto_1.scryptSync)(inputPassword, salt, 32).toString("hex");
    return hashedPassword === hashedInputPassword;
};
exports.comparePasswords = comparePasswords;
function createUser(newUser) {
    return __awaiter(this, void 0, void 0, function () {
        // checks if provided email already exists, if not -> new user gets created
        function createUserHelper(email) {
            return __awaiter(this, void 0, void 0, function () {
                var rows;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, exports.connection.query("SELECT email\n    FROM users\n    WHERE email = ?\n    ", [email])];
                        case 1:
                            rows = (_a.sent())[0];
                            return [2 /*return*/, rows[0]];
                    }
                });
            });
        }
        var promGetEmail;
        return __generator(this, function (_a) {
            promGetEmail = new Promise(function (resolve, reject) {
                resolve(createUserHelper(newUser.email));
            });
            promGetEmail.then(function (result) {
                if (result) {
                    console.log("email already in db");
                }
                else {
                    var result_1 = exports.connection.query("INSERT INTO users (username, email, password, is_admin) VALUES (?, ?, ?, ?)", [newUser.username, newUser.email, newUser.password, newUser.is_admin])[0];
                    console.log("successfully added new user!");
                }
            });
            return [2 /*return*/];
        });
    });
}
exports.createUser = createUser;
function getUsers() {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.connection.execute("SELECT * FROM users")];
                case 1:
                    rows = (_a.sent())[0];
                    return [2 /*return*/, rows];
            }
        });
    });
}
exports.getUsers = getUsers;
function getUsersByChatId(chat_id, currentUserId) {
    return __awaiter(this, void 0, void 0, function () {
        var rows, users, _i, rows_1, row, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.connection.query("SELECT * FROM chat_users WHERE chat_id = ? AND user_id != ?", [chat_id, currentUserId])];
                case 1:
                    rows = (_a.sent())[0];
                    users = [];
                    _i = 0, rows_1 = rows;
                    _a.label = 2;
                case 2:
                    if (!(_i < rows_1.length)) return [3 /*break*/, 5];
                    row = rows_1[_i];
                    return [4 /*yield*/, getUserById(row.user_id)];
                case 3:
                    user = _a.sent();
                    if (user) {
                        users.push(user);
                    }
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, users];
            }
        });
    });
}
exports.getUsersByChatId = getUsersByChatId;
function getUserById(id) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.connection.execute("SELECT * FROM users WHERE id = ?", [
                        id,
                    ])];
                case 1:
                    rows = (_a.sent())[0];
                    if (!rows) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, rows[0]];
            }
        });
    });
}
exports.getUserById = getUserById;
function getUserByMail(email) {
    return __awaiter(this, void 0, void 0, function () {
        var rows, user, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, exports.connection.execute('SELECT * FROM users WHERE email = ?', [email])];
                case 1:
                    rows = (_a.sent())[0];
                    if (rows.length > 0) {
                        user = rows[0];
                        return [2 /*return*/, user];
                    }
                    throw new Error('No user found');
                case 2:
                    error_2 = _a.sent();
                    console.error(error_2);
                    throw new Error('Failed to get user');
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getUserByMail = getUserByMail;
function getMessagesByChatId(chatId) {
    return __awaiter(this, void 0, void 0, function () {
        var rows, messages;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.connection.execute("SELECT * FROM messages WHERE chat_id = ?", [chatId])];
                case 1:
                    rows = (_a.sent())[0];
                    return [4 /*yield*/, Promise.all(rows.map(function (row) { return __awaiter(_this, void 0, void 0, function () {
                            var user;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, getUserById(row.user_id)];
                                    case 1:
                                        user = _a.sent();
                                        return [2 /*return*/, __assign(__assign({}, row), { username: user.username })];
                                }
                            });
                        }); }))];
                case 2:
                    messages = _a.sent();
                    return [2 /*return*/, messages];
            }
        });
    });
}
exports.getMessagesByChatId = getMessagesByChatId;
function getMatchingUser(inputString) {
    return __awaiter(this, void 0, void 0, function () {
        var rows, users;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!inputString)
                        return [2 /*return*/, []];
                    return [4 /*yield*/, exports.connection.execute("SELECT * FROM users WHERE username LIKE ?", ["%".concat(inputString, "%")])];
                case 1:
                    rows = (_a.sent())[0];
                    return [4 /*yield*/, Promise.all(rows.map(function (row) { return __awaiter(_this, void 0, void 0, function () {
                            var user;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, getUserById(row.id)];
                                    case 1:
                                        user = _a.sent();
                                        return [2 /*return*/, __assign(__assign({}, row), { username: user.username })];
                                }
                            });
                        }); }))];
                case 2:
                    users = _a.sent();
                    return [2 /*return*/, users];
            }
        });
    });
}
exports.getMatchingUser = getMatchingUser;
// ALL WORK TILL HERE
function createChatUser(newChatUser) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.connection.execute("INSERT INTO chat_users (user_id, chat_id) VALUES (?, ?)", [newChatUser.user.id, newChatUser.chat_id])];
                case 1:
                    rows = (_a.sent())[0];
                    return [2 /*return*/, rows];
            }
        });
    });
}
exports.createChatUser = createChatUser;
function createChat(chatName, adminId, isRoom) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.connection.execute("INSERT INTO chats (name, chat_admin_id, isRoom) VALUES (?, ?, ?)", [chatName, adminId, isRoom])];
                case 1:
                    result = (_a.sent())[0];
                    return [2 /*return*/, result];
            }
        });
    });
}
exports.createChat = createChat;
function changeProfilePicture(image, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.connection.execute('UPDATE users SET profile_picture = ? WHERE id = ?', [image, userId])];
                case 1:
                    result = (_a.sent())[0];
                    return [2 /*return*/, result];
            }
        });
    });
}
exports.changeProfilePicture = changeProfilePicture;
function changeChatPicture(chatId, image) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.connection.execute("UPDATE chats SET chat_picture = ? WHERE id = ?", [image, chatId])];
                case 1:
                    result = (_a.sent())[0];
                    return [2 /*return*/, result];
            }
        });
    });
}
exports.changeChatPicture = changeChatPicture;
function getProfilePicture(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.connection.execute('SELECT profile_picture FROM users WHERE id = ?', [userId])];
                case 1:
                    result = (_a.sent())[0];
                    return [2 /*return*/, result];
            }
        });
    });
}
exports.getProfilePicture = getProfilePicture;
function deleteChat(chatId) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.connection.query("SELECT id FROM chats WHERE id = ?", [chatId])];
                case 1:
                    res = (_a.sent())[0];
                    if (!(res.id != undefined)) return [3 /*break*/, 8];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 6, 7]);
                    return [4 /*yield*/, exports.connection.execute("DELETE FROM chat_users WHERE chat_id = ?", [chatId,])];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, exports.connection.execute("DELETE FROM messages WHERE chat_id = ?", [chatId,])];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, exports.connection.execute("DELETE FROM chats WHERE id = ?", [chatId])];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    exports.connection.end();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/, "Successfully deleted Chat"];
                case 8: return [2 /*return*/, "There is no Chat with id ".concat(chatId)];
            }
        });
    });
}
exports.deleteChat = deleteChat;
;
function addUserToChat(userId, chatId) {
    return __awaiter(this, void 0, void 0, function () {
        var res, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.connection.query("SELECT id FROM chat_users WHERE user_id = ?", [userId])];
                case 1:
                    res = (_a.sent())[0];
                    if (!(res.id != undefined)) return [3 /*break*/, 3];
                    return [4 /*yield*/, exports.connection.execute("INSERT INTO chat_users (user_id, chat_id) VALUES (?, ?)", [userId, chatId])];
                case 2:
                    result = (_a.sent())[0];
                    return [2 /*return*/, "Successfully added User to Chat."];
                case 3: return [2 /*return*/, "User already in Chat"];
            }
        });
    });
}
exports.addUserToChat = addUserToChat;
function removeUserFromChat(userId, chatId) {
    return __awaiter(this, void 0, void 0, function () {
        var res, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.connection.query("SELECT id FROM chat_users WHERE user_id = ?", [userId])];
                case 1:
                    res = (_a.sent())[0];
                    if (res.id != undefined) {
                        result = exports.connection.execute("DELETE FROM chat_users WHERE user_id = ? AND chat_id = ?", [userId, chatId])[0];
                        return [2 /*return*/, "Successfully deleted User from Chat"];
                    }
                    else {
                        return [2 /*return*/, "User is not in Chat"];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.removeUserFromChat = removeUserFromChat;
function getChatById(id) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.connection.execute("SELECT * FROM chats WHERE id = ?", [
                        id,
                    ])];
                case 1:
                    rows = (_a.sent())[0];
                    if (rows.length === 0) {
                        return [2 /*return*/, "No Chats for given Id found"];
                    }
                    return [2 /*return*/, rows[0]];
            }
        });
    });
}
exports.getChatById = getChatById;
function getChatsByUserId(user_id) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.connection.execute("SELECT c.id, c.name, c.created_on, c.last_message, c.last_message_sent, c.chat_admin_id, c.isRoom, c.chat_picture FROM chats c, chat_users cu WHERE cu.chat_id = c.id AND cu.user_id = ?", [user_id])];
                case 1:
                    rows = (_a.sent())[0];
                    if (rows.length === 0) {
                        return [2 /*return*/, "No Chats for given User found"];
                    }
                    return [2 /*return*/, rows];
            }
        });
    });
}
exports.getChatsByUserId = getChatsByUserId;
function getAllChats() {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.connection.execute("SELECT * FROM chats")];
                case 1:
                    rows = (_a.sent())[0];
                    return [2 /*return*/, rows];
            }
        });
    });
}
exports.getAllChats = getAllChats;
function sendMessage(newMessage) {
    return __awaiter(this, void 0, void 0, function () {
        var result, currentTime, res, resu;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.connection.execute("INSERT INTO messages (user_id, chat_id, msg_type, msg) VALUES (?, ?, ?, ?)", [
                        newMessage.user_id,
                        newMessage.chat_id,
                        newMessage.msg_type,
                        newMessage.msg,
                    ])];
                case 1:
                    result = (_a.sent())[0];
                    currentTime = new Date();
                    return [4 /*yield*/, exports.connection.execute("UPDATE chats SET last_message = ?, last_message_sent = ? WHERE chats.id = ?", [newMessage.msg, currentTime, newMessage.chat_id])];
                case 2:
                    res = (_a.sent())[0];
                    return [4 /*yield*/, getMessageById(result.insertId)];
                case 3:
                    resu = _a.sent();
                    return [2 /*return*/, resu];
            }
        });
    });
}
exports.sendMessage = sendMessage;
function getMessageById(id) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.connection.execute("SELECT m.*, u.username FROM messages m JOIN users u ON m.user_id = u.id WHERE m.id = ?", [id])];
                case 1:
                    rows = (_a.sent())[0];
                    if (rows.length === 0) {
                        return [2 /*return*/, "No message found for given ID"];
                    }
                    return [2 /*return*/, rows[0]];
            }
        });
    });
}
exports.getMessageById = getMessageById;
function getAllMessagesForUser(user) {
    return __awaiter(this, void 0, void 0, function () {
        var result, rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.connection.query("SELECT msg, msg_type, created_on FROM messages WHERE user_id = ?", [user.id])];
                case 1:
                    rows = (_a.sent())[0];
                    return [2 /*return*/, rows];
            }
        });
    });
}
exports.getAllMessagesForUser = getAllMessagesForUser;
;
function getChatUsersForChat(chatId) {
    return __awaiter(this, void 0, void 0, function () {
        var result, rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.connection.query("SELECT user_id FROM chat_users WHERE chat_id = ?", [chatId])];
                case 1:
                    rows = (_a.sent())[0];
                    return [2 /*return*/, rows];
            }
        });
    });
}
exports.getChatUsersForChat = getChatUsersForChat;
;
function getAllMessagesForChat(chat) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.connection.query("SELECT m.msg, m.msg_type, m.created_on FROM messages m, chats c, chat_users cu WHERE c.id = ? AND cu.chat_id = c.id", [chat.id])];
                case 1:
                    rows = (_a.sent())[0];
                    return [2 /*return*/, rows];
            }
        });
    });
}
exports.getAllMessagesForChat = getAllMessagesForChat;
;
exports.default = exports.connection;
//# sourceMappingURL=dbTools.js.map