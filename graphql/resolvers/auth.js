const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');

module.exports = {

    createUser: async (args) => {
        try {
            const creator = await User.findOne({ email: args.userInput.email })

            if (creator) {
                throw new Error('User exists already.')
            }

            const hashedPwd = await bcrypt.hash(args.userInput.password, 12)

            const createdUser = new User({
                email: args.userInput.email,
                password: hashedPwd
            })
            const savedRes = await createdUser.save();
            return { ...savedRes._doc, password: null }

        }
        catch (err) {
            throw err
        }

    },

    login: async ({ email, password }) => {
        const user = await User.findOne({ email: email })

        console.log(user._doc)
        console.log(user._id)
        console.log(user.email)
        if (!user) {
            throw new Error('user does not exist')
        }
        const isEqual = await bcrypt.compare(password, user.password)

        if (!isEqual) {
            throw new Error('incorrect password')
        }



        const token = jwt.sign(
            { userId: user.id, email: user.email },
            `${process.env.SECRET_KEY}`,
            {
                expiresIn: '1h'
            }
        );
        return { userId: user.id, token: token, tokenExpiration: 1 };
    },

}