import { Request, Response } from 'express';
import {
  getObject,
  getObjectOrNull,
  upsertObject,
  couchbaseN1QLCollection,
} from '../config/connection';
import constants from '../config/constants';
import { mapper } from '../helpers/game.mapper.helper';

const { DBDocType } = constants;

export class GameConfig {
  addGameObject = async (req: Request, res: Response): Promise<void> => {
    const gameVariable = ((req as Request & { validatedParams?: Record<string, unknown> }).validatedParams ?? req.body) as Record<string, unknown>;
    const existing = await getObjectOrNull(gameVariable.gameName as string);
    if (existing) {
      res.error('GAME_EXISTS');
      return;
    }
    try {
      gameVariable.docType = DBDocType.GAME;
      gameVariable.createdAt = Date.now();
      gameVariable.deletedAt = 0;
      gameVariable.updateAt = 0;
      await upsertObject(gameVariable.gameName as string, gameVariable);
      const mapData = mapper.gameConfigeEditUpdateDelete(gameVariable);
      res.ok({ message: 'GAME_DATA', data: mapData });
    } catch {
      res.error('UNSUCCESS');
    }
  };

  editGameObject = async (req: Request, res: Response): Promise<void> => {
    const gameVariable = ((req as Request & { validatedParams?: Record<string, unknown> }).validatedParams ?? req.body) as Record<string, unknown>;
    try {
      const reslt = await getObject(gameVariable.gameName as string);
      const content = reslt.content as Record<string, unknown>;
      if (req.params.gameName !== gameVariable.gameName) {
        res.error('GAMENAME_NOT_CHANGE');
        return;
      }
      if (req.body.createdAt) {
        res.error('CREATEDAT_NOT_CHANGE');
        return;
      }
      gameVariable.updateAt = Date.now();
      gameVariable.createdAt = content.createdAt;
      gameVariable.deletedAt = content.deletedAt;
      await upsertObject(gameVariable.gameName as string, gameVariable);
      const mapData = mapper.gameConfigeEditUpdateDelete(gameVariable);
      res.ok({ message: 'GAME_DATA', data: mapData });
    } catch {
      res.notFound('NOT_FOUND');
    }
  };

  deletGameObject = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await getObject(req.params.gameName);
      const content = result.content as Record<string, unknown>;
      if (content.deletedAt !== 0) {
        res.error('ALL_READY_DELETED');
        return;
      }
      content.deletedAt = Date.now();
      await upsertObject(content.gameName as string, content);
      res.ok({ message: 'DELETE_GAMECONFIG' });
    } catch {
      res.notFound('NOT_GAME_EXISTS');
    }
  };

  getAllGame = async (_req: Request, res: Response): Promise<void> => {
    try {
      const rows = await couchbaseN1QLCollection(
        "SELECT * FROM `slot-game` as games WHERE docType='game' and deletedAt == 0"
      );
      const mapData = mapper.allGameConfig(rows.rows as { games: Record<string, unknown> }[]);
      res.ok({ message: 'OK', data: mapData });
    } catch {
      res.error('ERROR');
    }
  };

  indexing = async (req: Request, res: Response): Promise<void> => {
    const perPage = parseInt(req.query.pageSize as string, 10);
    const page = parseInt(req.query.page as string, 10) || 1;
    const offset = (page - 1) * perPage;
    let foundGameQuary =
      "SELECT * FROM `slot-game` as games WHERE docType = 'game' AND deletedAt == 0 ";
    let countGameQuary =
      "SELECT COUNT(gameName) as totalGame FROM `slot-game` WHERE docType = 'game'";
    const paginateQuery = `limit ${perPage} OFFSET ${offset}`;
    if (req.query.gameName) {
      countGameQuary =
        countGameQuary +
        `AND lower(gameName) like lower('%${req.query.gameName}%')`;
      foundGameQuary =
        foundGameQuary +
        `AND lower(gameName) like lower('%${req.query.gameName}%')` +
        paginateQuery;
    } else {
      foundGameQuary = foundGameQuary + paginateQuery;
    }
    try {
      const games = await couchbaseN1QLCollection(countGameQuary);
      const totalGame = (games.rows[0] as { totalGame: number })?.totalGame ?? 0;
      const result = await couchbaseN1QLCollection(foundGameQuary);
      const mapData = mapper.allGameConfig(
        result.rows as { games: Record<string, unknown> }[],
        page,
        totalGame,
        perPage
      );
      res.ok({ message: 'OK', data: mapData });
    } catch {
      res.error('ERROR');
    }
  };

  getGame = async (req: Request, res: Response): Promise<void> => {
    try {
      const game = await getObject(req.params.gameName);
      const mapData = mapper.gameConfigeEditUpdateDelete(game.content as Record<string, unknown>);
      res.ok({ message: 'OK', data: mapData });
    } catch {
      res.notFound('NOT_FOUND');
    }
  };
}

export const gameConfig = new GameConfig();
