interface GameRow {
  games: Record<string, unknown>;
}

export class Mapper {
  allGameConfig = (
    rows: GameRow[],
    page?: number,
    totalGame?: number,
    perPage?: number
  ): { gameConfig: unknown[]; page?: number; totalGame?: number; totalPage?: number; perPage?: number } => {
    const gameConfig: unknown[] = [];
    const totalPage = totalGame != null && perPage != null ? Math.ceil(totalGame / perPage) : 0;
    rows.forEach((data) => {
      const { gameName, viewZone, payarray, payTable, arrayOfReel, maxWinAmount } = data.games;
      gameConfig.push({ gameName, viewZone, payarray, payTable, arrayOfReel, maxWinAmount });
    });
    return { gameConfig, page, totalGame, totalPage, perPage };
  };

  gameConfigeEditUpdateDelete = (gameVariable: Record<string, unknown>): Record<string, unknown> => {
    const { gameName, viewZone, payarray, payTable, arrayOfReel, maxWinAmount } = gameVariable;
    return { gameName, viewZone, payarray, payTable, arrayOfReel, maxWinAmount };
  };
}

export const mapper = new Mapper();
