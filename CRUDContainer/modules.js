const db_config = require('./config/database.config.js');
const MongoClient = require('mongodb').MongoClient;

const getUser = async(params) => {
    // Verify Access Token
    const isVerified = await verifyToken(params.accesstoken, 'all');

    if (!isVerified.verified) {
        const retval = {
            status: 400,
            message: 'Access Denied',
        }
        return retval;
    } else {
        // Connect to Mongo Client
        const client = await MongoClient.connect(db_config.url, { useNewUrlParser: true }).catch(err => { console.log(err); });

        try {
            // Connect to SejutaCita DB
            const db = client.db("SejutaCita");

            // Bind to users Collection
            const collection = db.collection('users');

            // Get All Data
            const res = await collection.find().toArray();

            // Build Response Payload
            const retval = {
                status: 200,
                message: 'These Are All Registered Users',
                data: res,
            }
            return retval;
        } catch (e) {
            const retval = {
                status: 500,
                message: e.message,
            }
            return retval;
        } finally {
            client.close();
        }
    }
};

const editUser = (params) => {

};

const deleteUSer = (params) => {

};

const verifyToken = (accessToken, permittedRole) => {
    try {
        // Verify Given Access Token
        const decodedToken = jwt.verify(accessToken, jwtSecret);

        // Verify Permitted Role
        if (permittedRole == 'admin' && decodedToken.role != permittedRole) {
            throw new Error('Your Role is Not Allowed to Access This Resources!');
        }

        const userLoggedIn = {
            status: true,
            user: decodedToken,
            message: 'success',
        };

        return userLoggedIn;
    } catch (err) {
        const userLoggedIn = {
            status: false,
            user: null,
            message: err.message,
        };
        return userLoggedIn;
    }
};

module.exports = {
    login,
    register,
    getUser,
    editUser,
    deleteUSer,
}