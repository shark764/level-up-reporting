import mongoose, { Schema } from 'mongoose';

const { ObjectId } = mongoose.Types;

const gameSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    leagueId: {
      type: Schema.Types.ObjectId,
      ref: 'leagues',
    },
    facilityId: {
      type: Schema.Types.ObjectId,
      ref: 'facilities',
    },
    from: {
      type: Date,
      required: true,
    },
    to: {
      type: Date,
      required: true,
    },
    dateCreated: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    dateUpdated: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    userCreated: {
      type: String,
      required: true,
    },
    userUpdated: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
  },
  {
    collection: 'games',
    timestamps: true,
  }
);

gameSchema.statics.createGame = function(data, loggedUser) {
  return new Promise((resolve, reject) => {
    const { name } = data;
    const game = Game.findOne({ name });

    game
      .then((result) => {
        if (result) {
          return reject({ statusCode: 409 });
        }

        try {
          const gameToCreate = new Game({
            name: data.name,
            facilityId: ObjectId(data.facilityId),
            leagueId: ObjectId(data.leagueId),
            from: new Date(data.from),
            to: new Date(data.to),
            userCreated: loggedUser,
            userUpdated: loggedUser,
            active: true,
          });

          resolve(gameToCreate.save(gameToCreate));
        } catch {
          return reject({ statusCode: 500 });
        }
      })
      .catch(() => reject({ statusCode: 500 }));
  });
};

export const Game = mongoose.model('Game', gameSchema);
