const mongoose = require("mongoose")

const permissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // e.g. "view_reports", "edit_user", "delete_post"
    },
    description: {
      type: String, // Optional, helps clarify purpose
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("permission",permissionSchema)