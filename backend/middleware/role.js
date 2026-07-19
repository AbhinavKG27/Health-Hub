const role_check = async (req, res, next) => {
    const admin_role = req.is_admin;
    if (admin_role !== true) {
        return res.status(403).json({message: "forbidden"});
    }
    next();
    return;
}
module.exports = role_check;