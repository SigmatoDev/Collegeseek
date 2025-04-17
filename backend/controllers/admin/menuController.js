
const Menu = require("../../models/admin/menuModel");

// Controller to GET all menus
exports.getMenus = async (req, res) => {
    try {
        const menus = await Menu.find().populate('columns.links'); // Populate nested links if necessary
        res.status(200).json({ success: true, data: menus });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// Controller for updating column title
exports.updateColumnTitle = async (req, res) => {
  console.log("hit mee")
    const { menuId, columnId } = req.params;
    const { title } = req.body;
  
    try {
      const updatedMenu = await Menu.findOneAndUpdate(
        { _id: menuId, "columns._id": columnId },
        { $set: { "columns.$.title": title } },
        { new: true, runValidators: true }
      );
  
      if (!updatedMenu) return res.status(404).json({ message: "Menu or column not found" });
  
      res.status(200).json({ success: true, data: updatedMenu });
    } catch (error) {
      console.error("Error in updateColumnTitle:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  exports.updateLink = async (req, res) => {
    console.log("hit update link")
    console.log("req.body", req.body);
  
    try {
      const { menuId, columnId, linkId } = req.params;
      const { label, url } = req.body;
  
      // Check if we have the correct params and body values
      console.log(`Menu ID: ${menuId}, Column ID: ${columnId}, Link ID: ${linkId}`);
  
      const result = await Menu.updateOne(
        {
          _id: menuId,
          "columns._id": columnId,
          "columns.links._id": linkId,
        },
        {
          $set: {
            "columns.$[col].links.$[lnk].label": label,
            "columns.$[col].links.$[lnk].url": url,
          },
        },
        {
          arrayFilters: [
            { "col._id": columnId },
            { "lnk._id": linkId },
          ],
          runValidators: true,
        }
      );
  
      if (result.modifiedCount === 0) {
        return res.status(404).json({ success: false, message: "Menu, column, or link not found or not modified." });
      }
  
      const updatedMenu = await Menu.findById(menuId);
  
      res.status(200).json({ success: true, data: updatedMenu });
    } catch (error) {
      console.error("Error in updateLink:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  