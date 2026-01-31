import { upsertObject } from '../config/connection';
import { gameVariable } from './gameData';
import constants from '../config/constants';

const { DBDocType } = constants;

export class GameConfig {
  seedGameObject = (): void => {
    const docType = DBDocType.GAME;
    const createdAt = Date.now();
    const data = {
      ...gameVariable,
      docType,
      createdAt,
      deletedAt: 0,
      updateAt: 0,
    };
    upsertObject(gameVariable.gameName, data as unknown as Record<string, unknown>)
      .then(() => {
        console.log('Myjackpot game seeded Successfully');
      })
      .catch((err) => {
        console.log('error :' + err);
      });
  };
}

const seeder = new GameConfig();
seeder.seedGameObject();
