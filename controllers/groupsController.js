const express = require('express');
const router  = express.Router();
const Group  = require('../models/group');
const Member  = require('../models/member');
const Event  = require('../models/event');
const Attendance  = require('../models/attendance');
const Request  = require('../models/request');
const bcrypt  = require('bcryptjs');

module.exports = router;