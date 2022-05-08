import React, { useEffect, useState } from "react";
import styles from "./HistoryBlock.module.scss";
import classes from "./HistoryBlock.module.scss"
import clsx from "clsx";
import api from "../../../../../../apis/api";
import { IUser } from "../../../../../../interface/user.interface";
import Avatar from "../../../Avatar/Avatar";
import { IGame } from "../../../../../../interface/game.interface";

//site imgLevel : https://www.dexerto.es/fifa/recompensas-de-fifa-20-fut-champions-rangos-de-la-weekend-league-1101381/
let imgLevel = new Map<string, string>();
imgLevel.set(
  "Bronze 3",
  "https://s3.eu-west-3.amazonaws.com/dexertoes-assets-production-7d0f29e6/uploads/articles/FIFA-20-FUT-Champions-Bronze-3-Rank.png"
);
imgLevel.set(
  "Bronze 2",
  "https://s3.eu-west-3.amazonaws.com/dexertoes-assets-production-7d0f29e6/uploads/articles/FIFA-20-FUT-Champions-Bronze-2-Rank.png"
);
imgLevel.set(
  "Bronze 1",
  "https://s3.eu-west-3.amazonaws.com/dexertoes-assets-production-7d0f29e6/uploads/articles/FIFA-20-FUT-Champions-Bronze-1-Rank.png"
);
imgLevel.set(
  "Silver 3",
  "https://s3.eu-west-3.amazonaws.com/dexertoes-assets-production-7d0f29e6/uploads/articles/FIFA-20-FUT-Champions-Silver-3-Rank.png"
);
imgLevel.set(
  "Silver 2",
  "https://s3.eu-west-3.amazonaws.com/dexertoes-assets-production-7d0f29e6/uploads/articles/FIFA-20-FUT-Champions-Silver-2-Rank.png"
);
imgLevel.set(
  "Silver 1",
  "https://s3.eu-west-3.amazonaws.com/dexertoes-assets-production-7d0f29e6/uploads/articles/FIFA-20-FUT-Champions-Silver-1-Rank.png"
);
imgLevel.set(
  "Gold 3",
  "https://s3.eu-west-3.amazonaws.com/dexertoes-assets-production-7d0f29e6/uploads/articles/FIFA-20-FUT-Champions-Gold-3-Rank.png"
);
imgLevel.set(
  "Gold 2",
  "https://s3.eu-west-3.amazonaws.com/dexertoes-assets-production-7d0f29e6/uploads/articles/FIFA-20-FUT-Champions-Gold-2-Rank.png"
);
imgLevel.set(
  "Gold 1",
  "https://s3.eu-west-3.amazonaws.com/dexertoes-assets-production-7d0f29e6/uploads/articles/FIFA-20-FUT-Champions-Gold-1-Rank.png"
);
imgLevel.set(
  "Elite 3",
  "https://s3.eu-west-3.amazonaws.com/dexertoes-assets-production-7d0f29e6/uploads/articles/FIFA-20-FUT-Champions-Elite-3-Rank.png"
);
imgLevel.set(
  "Elite 2",
  "https://s3.eu-west-3.amazonaws.com/dexertoes-assets-production-7d0f29e6/uploads/articles/FIFA-20-FUT-Champions-Elite-2-Rank.png"
);
imgLevel.set(
  "Elite 1",
  "https://s3.eu-west-3.amazonaws.com/dexertoes-assets-production-7d0f29e6/uploads/articles/FIFA-20-FUT-Champions-Elite-1-Rank.png"
);

function ftSetLevel(pongopoints: number) {
  if (pongopoints < 100) return "Bronze 3";
  else if (pongopoints < 200) return "Bronze 2";
  else if (pongopoints < 300) return "Bronze 1";
  else if (pongopoints < 400) return "Silver 3";
  else if (pongopoints < 500) return "Silver 2";
  else if (pongopoints < 600) return "Silver 1";
  else if (pongopoints < 700) return "Gold 3";
  else if (pongopoints < 800) return "Gold 2";
  else if (pongopoints < 900) return "Gold 1";
  else if (pongopoints < 1000) return "Elite 3";
  else if (pongopoints < 1100) return "Elite 2";
  else return "Elite 1";
}

interface Props {
  user: IUser;
}

function HistoryBlock(props: Props) {
  const [historic, setHistoric] = useState<IGame[]>([]);
  useEffect(() => {
    api
      .get(`/users/history/${props.user.id}`)
      .then((response) => {
        setHistoric(response.data);
        console.log("response=", response.data);
      })
      .catch((reject) => console.error(reject));
  }, []);

  function divScore(score1: number, score2: number) {
    if (score1 < score2) return classes.ScoreLoser;
    return classes.ScoreWinner;
  }

  function getMatchDay(matchDate:string)
  {
    let cutDate = matchDate.split('T');
    let cutDate2= cutDate[0].split('-')
    return (cutDate2[2]);
  }

  function getMatchMounth(matchDate:string)
  {
    let cutDate = matchDate.split('T');
    let cutDate2= cutDate[0].split('-')
    return (cutDate2[1]);
  }

  return (
    <div className={classes.HistoryBlock}>
      <h3 className={classes.title}>History</h3>
      <div className={classes.History}>
        <div className={classes.MatchsList}>
          {historic.map((match: IGame, index: number) => (
            <div className={classes.Match} key={index}>
              <h4>{getMatchDay(match.created_at)}/{getMatchMounth(match.created_at)}</h4>
              <div className={classes.MatchUserLeft}>
                <Avatar user={match.players[0].user} />
                <p className={clsx(classes.Username, classes.UsernameLeft)}>
                  <span>{match.players[0].user.username}</span>
                </p>
                <img
                  className={clsx(classes.ImgLevelElement, classes.ImgLevelElementLeft)}
                  src={imgLevel.get(ftSetLevel(match.players[0].elo))}
                ></img>
                <p className={clsx(classes.Score, divScore(match.players[0].score,match.players[1].score))}>{match.players[0].score}</p>
              </div>
              <p className={classes.ScoreSeparator}>-</p>
              <div className={classes.MatchUserRight}>
                <p className={clsx(classes.Score,divScore(match.players[1].score,match.players[0].score))}>{match.players[1].score}</p>
                <img
                  className={clsx(classes.ImgLevelElement, classes.ImgLevelElementRight)}
                  src={imgLevel.get(ftSetLevel(match.players[1].elo))}
                ></img>
                <p className={clsx(classes.Username, classes.UsernameRight)}>
                  <span>{match.players[1].user.username}</span>
                </p>
                <Avatar user={match.players[1].user} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HistoryBlock;
