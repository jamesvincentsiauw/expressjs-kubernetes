const db_config = require('./config/database.config.js');
const MongoClient = require('mongodb').MongoClient;
const axios = require('axios');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const getUser = async(params) => {
    // Verify Access Token
    const isVerified = await verifyTokenAPI(params.accesstoken, 'all');

    if (!isVerified.data.verified) {
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

const editUser = async(headers, params) => {
    // Verify Access Token
    const isVerified = await verifyTokenAPI(headers.accesstoken, 'admin');

    if (!isVerified.data.verified) {
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

            // Update Query
            const query = {
                username: params.username,
            };

            // Get Related Doc
            const doc = await collection.findOne(query);

            console.log(doc == null);

            // If USer with Spesific Username not Found
            if (doc == null) {
                const retval = {
                    status: 400,
                    message: 'User Not Found',
                }
                return retval;
            }

            // Iterate through params to processing payload
            for (let item in params) {
                // Change Password Handling
                if (item == 'password') {
                    doc[item] = await bcrypt.hash(params[item], saltRounds);
                } else {
                    doc[item] = params[item];
                }
            }

            // Update All Data
            const res = await collection.updateOne(query, { $set: doc });

            // Build Response Payload
            const retval = {
                status: 200,
                message: 'User Updated',
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

const deleteUSer = (params) => {

};

const verifyTokenAPI = (accesstoken, role) => {
    // Verify Token to Auth Container
    const isVerified = axios({
        method: 'POST',
        url: 'http://172.17.0.2:3000/verifytoken',
        headers: {
            accesstoken: accesstoken,
        },
        data: {
            permittedRole: role,
        }
    });

    return isVerified;
}
module.exports = {
    getUser,
    editUser,
    deleteUSer,
}