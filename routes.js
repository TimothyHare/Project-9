'use strict';

const express = require('express');
const router = express.Router();
const {User, Course} = require("./models");
const bcrypt = require('bcryptjs');
const authorize = require('basic-auth');