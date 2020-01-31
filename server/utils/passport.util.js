import FacebookStrategy from 'passport-facebook'
import GraphqlPassport from 'graphql-passport'
import pgClient from '../pgClient'

import { facebook } from '../../config'
import { models } from '../_sequelize'
import { Slack } from './slack.util'

const { GraphQLLocalStrategy } = GraphqlPassport

function serialize (user, done) {
  return done(null, user.id)
}

function deserialize (id, done) {
  pgClient
    .query('select * from app_public.users where id=$1', [id])
    .then(({ rows: [user] }) => {
      if (user.status === 1) {
        done(null, false, { message: 'user is blocked' })
      } else {
        done(null, user)
      }
    })
    .catch(err => done(err))
}

const localStrategy = new GraphQLLocalStrategy((email, password, done) => {
  pgClient
    .query('select * from app_public.users where email=$1', [email])
    .then(({ rows: [user] }) => {
      const noUserInfo = { message: 'invalid credentials', errorCode: 1 }
      if (!user) {
        return done(null, false, noUserInfo)
      }

      if (!user.password) {
        if (user.facebookId) {
          return done(null, false, { message: 'try facebook', errorCode: 2 })
        } else {
          Slack.invalidLogin(email, user)
          return done(null, false, noUserInfo)
        }
      }

      if (user.status === 1) {
        return done(null, false, { message: 'user is blocked' })
      }

      return user.comparePassword(password).then(isCorrect => {
        if (isCorrect) {
          return done(null, user)
        } else {
          return done(null, false, noUserInfo)
        }
      })
    })
    .catch(done)
})

const facebookStrategy = new FacebookStrategy(
  {
    clientID: facebook.appId,
    clientSecret: facebook.appSecret,
    callbackURL: facebook.callback,
    profileFields: ['id', 'email', 'first_name', 'last_name']
  },
  async (accessToken, refreshToken, profile, done) => {
    const email = profile.emails && profile.emails[0] && profile.emails[0].value

    const {
      rows: [matchingUser]
    } = await pgClient.query(
      'select * from app_public.users where facebook_id=$1 or email=$2',
      [profile.id, email]
    )

    if (matchingUser) {
      if (matchingUser.status === 1) {
        done(null, false, { message: 'user is blocked' })
      } else {
        done(null, matchingUser)
      }
      return
    }

    const user = await models.User.create({
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      facebookId: profile.id,
      email
    })
    Slack.newUser({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      source: 'facebook'
    })

    done(null, user)
  }
)

export function configurePassport (passport) {
  passport.serializeUser(serialize)
  passport.deserializeUser(deserialize)
  passport.use(localStrategy)
  passport.use(facebookStrategy)
}
