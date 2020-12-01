const db_config = require('./config/database.config.js');
const MongoClient = require('mongodb').MongoClient;
const jwt = require('jsonwebtoken');
const jwtSecret = 'secretx123';
const bcrypt = require('bcrypt');
const saltRounds = 10;

const login = async(params) => {
    // Fetch Data from params
    const { username, password } = params;
    let retval;

    // Connect to Mongo Client
    const client = await MongoClient.connect(db_config.url, { useNewUrlParser: true }).catch(err => { console.log(err); });

    try {
        // Connect to SejutaCita DB
        const db = client.db("SejutaCita");

        // Bind to users Collection
        const collection = db.collection('users');

        // Payload to search
        const searchedUser = {
            username: username
        };

        // Check User in DB
        const user = await collection.findOne(searchedUser);

        if (user) {

            // Check Hashed Pasword
            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                // Build Response Payload
                retval = {
                    status: 400,
                    message: 'Wrong Password',
                }
            } else {
                // Sign JWT Token
                const accessToken = await jwt.sign(user, jwtSecret, { expiresIn: '12h' });

                // Build Response Payload
                retval = {
                    status: 200,
                    message: 'Access Given',
                    data: {
                        accessToken: accessToken,
                        user: user,
                    }
                }
            }
        } else {
            // Build Response Payload
            retval = {
                status: 400,
                message: 'Wrong Username',
            }
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
};

const register = async(headers, params) => {
    // Verify Access Token
    const isVerified = await verifyToken(headers.accesstoken, 'admin');

    if (!isVerified.verified) {
        const retval = {
            status: 400,
            message: 'Access Denied',
        }
        return retval;
    } else {
        // Fetch Data from params
        const { name, username, password, role } = params;

        // Connect to Mongo Client
        const client = await MongoClient.connect(db_config.url, { useNewUrlParser: true }).catch(err => { console.log(err); });

        try {
            // Connect to SejutaCita DB
            const db = client.db("SejutaCita");

            // Bind to users Collection
            const collection = db.collection('users');

            // Prepare New User Payload
            const newUser = {
                name: name,
                username: username,
                password: await bcrypt.hash(password, saltRounds),
                role: role,
            };

            // Insert Data to DB
            await collection.insertOne(newUser, (err) => { if (err) throw new Error('Error When Registering User') })

            // Build Response Payload
            const retval = {
                status: 201,
                message: 'New User Registered',
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

const verifyToken = (accessToken, permittedRole) => {
    try {
        // Verify Given Access Token
        const decodedToken = jwt.verify(accessToken, jwtSecret);

        // Verify Permitted Role
        if (permittedRole == 'admin' && decodedToken.role != permittedRole) {
            throw new Error('Your Role is Not Allowed to Access This Resources!');
        }

        const userLoggedIn = {
            status: 200,
            verified: true,
            user: decodedToken,
            message: 'success',
        };

        return userLoggedIn;
    } catch (err) {
        const userLoggedIn = {
            status: 400,
            verified: false,
            user: null,
            message: err.message,
        };
        return userLoggedIn;
    }
};

const registerAdmin = async() => {
    const params = {
        name: "Vincent",
        username: "vincentsiauw",
        password: "password",
        role: "admin",
    }

    // Fetch Data from params
    const { name, username, password, role } = params;

    // Connect to Mongo Client
    const client = await MongoClient.connect(db_config.url, { useNewUrlParser: true }).catch(err => { console.log(err); });

    try {
        // Connect to SejutaCita DB
        const db = client.db("SejutaCita");

        // Bind to users Collection
        const collection = db.collection('users');

        // Prepare New User Payload
        const newUser = {
            name: name,
            username: username,
            password: await bcrypt.hash(password, saltRounds),
            role: role,
        };

        // Insert Data to DB
        await collection.insertOne(newUser, (err) => { if (err) throw new Error('Error When Registering User') })

        // Build Response Payload
        const retval = {
            status: 200,
            message: 'Admin Registered',
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
};
module.exports = {
    login,
    register,
    verifyToken,
    registerAdmin,
}