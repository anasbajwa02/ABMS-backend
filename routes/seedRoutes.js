// routes/seedRoutes.js
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const ApiError = require("../utils/ApiError.js")

const User = require("../models/user.models.js");
const Role = require("../models/role.models.js");
const Permission = require("../models/permission.model.js");

if (process.env.NODE_ENV === "development") {
  router.post("/setup", async (req, res) => {
    try {
      //  Check if owner already exists

      const ownerRole = await Role.findOne({ name: "owner" });

      const existingOwner = ownerRole
        ? await User.findOne({ roles: ownerRole._id })
        : null;

      if (existingOwner) {
        return res.status(400).json({ message: "Owner already exists" });
      }

      //  Create some basic permissions
      const permissionNames = [
        "manage_users",
        "manage_roles",
        "manage_permissions",
        "view_reports",
      ];

      const permissions = await Permission.insertMany(
        permissionNames.map((name) => ({ name })),
        { ordered: false }
      ).catch(() => {}); // ignore duplicates

      const allPermissions = await Permission.find();

      //  Create owner role with all permissions

      const ownerRoleData = await Role.create({
        name: "owner",
        permissions: allPermissions.map((p) => p._id),
      });

      //  Create owner user

      const { name, email, password } = req.body;

      console.log(name,email,password)

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const ownerUser = await User.create({
        name,
        email,
        password,
        roles: [ownerRoleData._id],
      });

      return res.status(201).json({
        message: "Owner user and roles/permissions created successfully",
        owner: {
          name: ownerUser.name,
          email: ownerUser.email,
          role: "owner",
        },
      });
    } catch (error) {
      console.error(error);
    throw new ApiError(500,error?.message || "Error during setup")
    }
  });
}

module.exports = router;
