"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const guest_controller_1 = require("src/controllers/guest.controller");
const router = (0, express_1.Router)();
router.get("/", guest_controller_1.baseUrl);
exports.default = router;
