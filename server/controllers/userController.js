
const getUsers = (req, res) => {
    res.send("Get all users");
};

const getUser = (req, res) => {
    res.send(`Get user ${req.params.id}`);
};

const createUser = (req, res) => {
    res.send("Create user");
};

const deleteUser = (req, res) => {
    res.send(`Delete user ${req.params.id}`);
};

module.exports = {
    getUsers,
    getUser,
    createUser,
    deleteUser
};