const Joi = require('joi')
const { ErrorUtil } = require('../internal/utils')
const { Op } = require('sequelize')
const { sequelize } = require('../infra/postgre')
const bcrypt = require('bcryptjs')
const ErrorMessage = {
  UsernameRequired: `harap isi field username`,
  UsernameAlphanum: `username hanya boleh huruf dan angka`,
  UsernameEmail: `username dalam format email`,
  UsernameMin: `username minimal {#limit} karakter`,
  PasswordRequired: `Harap isi field password`,
  PasswordMin: `password minimal {#limit} karakter`,
  EmailRequired: `Harap isi field email`,
  EmailMin: `Email minimal {#limit} karakter`,
  PhoneRequired: `Harap isi field Phone`,
  PhoneMin: `Phone minimal {#limit} karakter`,
  PhoneNum: `Phone hanya boleh angka`,
}

module.exports = ({ models }) => {
  return {
    ValidateSigninReq: async (body = {}) => {
      try {
        // const validateUsername = await Joi.object({
        //   identifier: Joi.string().optional().min(3),
        //   password: Joi.string().required().min(8),
        // })

        // const validateEmail = await Joi.object({
        //   identifier: Joi.string().email().optional().min(8),
        //   password: Joi.string().required().min(8),
        // })

        // const validatePhone = await Joi.object({
        //   identifier: Joi.string()
        //     .optional()
        //     .min(11)
        //     .pattern(/^[0-9]/),
        //   password: Joi.string().required().min(8),
        // })

        // if (validateUsername.validate(body)) {
        //   console.log(validateUsername.validate(body))
        //   console.log(validateUsername.validate(body).value.identifier)
        // }
        // if (validateEmail.validate(body)) {
        //   console.log(validateEmail.validate(body))
        // }
        // if (validatePhone.validate(body)) {
        //   console.log(validatePhone.validate(body))
        // }

        const validated = await Joi.object({
          identifierVar: Joi.string().required().min(8),
          password: Joi.string().required().min(8).messages({
            'any.required': ErrorMessage.PasswordRequired,
            'string.base': ErrorMessage.PasswordRequired,
            'string.empty': ErrorMessage.PasswordRequired,
            'string.required': ErrorMessage.PasswordRequired,
            'string.min': ErrorMessage.PasswordMin,
          }),
        }).validateAsync(body)

        return validated
      } catch (err) {
        throw ErrorUtil.ParseJOIError(err)
      }
    },
    ValidatePassword: async (password, signedHash) => {
      return bcrypt.compareSync(password, signedHash)
    },
    ValidateSignUp: async (body) => {
      try {
        const validated = await Joi.object({
          username: Joi.string().required().min(8).messages({
            'any.required': ErrorMessage.UsernameRequired,
            'string.base': ErrorMessage.UsernameRequired,
            'string.required': ErrorMessage.UsernameRequired,
            'string.empty': ErrorMessage.UsernameRequired,
            'string.min': ErrorMessage.UsernameMin,
          }),
          password: Joi.string().required().min(8).messages({
            'any.required': ErrorMessage.PasswordRequired,
            'string.base': ErrorMessage.PasswordRequired,
            'string.empty': ErrorMessage.PasswordRequired,
            'string.required': ErrorMessage.PasswordRequired,
            'string.min': ErrorMessage.PasswordMin,
          }),
          email: Joi.string().email().required().min(8).messages({
            'any.required': ErrorMessage.EmailRequired,
            'string.base': ErrorMessage.EmailRequired,
            'string.empty': ErrorMessage.EmailRequired,
            'string.required': ErrorMessage.EmailRequired,
            'string.min': ErrorMessage.EmailMin,
          }),
          phone: Joi.string()
            .required()
            .min(11)
            .pattern(/^[0-9]/)
            .messages({
              'any.required': ErrorMessage.PhoneRequired,
              'string.base': ErrorMessage.PhoneRequired,
              'string.empty': ErrorMessage.PhoneRequired,
              'string.required': ErrorMessage.PhoneRequired,
              'string.min': ErrorMessage.PhoneMin,
            }),
          fullName: Joi.string().required().min(3),
          roles: Joi.array().optional(),
        }).validateAsync(body)

        return validated
      } catch (err) {
        throw ErrorUtil.ParseJOIError(err)
      }
    },

    Register: async (body) => {
      try {
        const found = await models.User.findOne({
          where: {
            [Op.or]: [
              {
                email: { [Op.eq]: body.email },
              },
              {
                username: { [Op.eq]: body.username },
              },
              {
                phone: { [Op.eq]: body.phone },
              },
            ],
          },
        })

        if (found && found.id !== null) {
          throw new Error(
            'email atau username atau no. telepon sudah digunakan'
          )
        }

        return sequelize.transaction(async (t) => {
          const createdProfile = await models.Profile.create({
            fullName: body.fullName,
          })

          const smsVerificationCode = Math.floor(
            100000 + Math.random() * 900000
          )

          const createdUser = await models.User.create(
            {
              username: body.username,
              email: body.email,
              phone: body.phone,
              password: bcrypt.hashSync(body.password, 8),
              profileId: createdProfile.id,
              smsVerificationCode: smsVerificationCode.toString(),
            },
            { transaction: t }
          )

          if (!createdUser) {
            throw new Error('create user failed')
          }

          let roleCondition = {}
          let fetchedRoles = []

          if (body.roles && body.roles.length > 0) {
            Promise.all(
              body.roles.map(async (el) => {
                fetchedRoles.push({ name: el })
              })
            )
          }

          let roles = null
          if (fetchedRoles.length > 0) {
            roles = await models.Role.findAll({
              attributes: ['id'],
              where: {
                [Op.or]: fetchedRoles,
              },
            })
          } else {
            roles = await models.Role.findAll({
              attributes: ['id'],
              where: {
                name: 'user',
              },
            })
          }

          // const roles = await models.Role.findAll({
          //   attributes: ['id'],
          //   where: {
          //     name: 'user',
          //   },
          // })

          if (roles.length > 0) {
            const payload = roles.map((el) => {
              return { userId: createdUser.id, roleId: el.id }
            })

            await models.UserRole.bulkCreate(payload, { transaction: t })
          }

          return createdUser
        })
      } catch (err) {
        throw err
      }
    },
  }
}
