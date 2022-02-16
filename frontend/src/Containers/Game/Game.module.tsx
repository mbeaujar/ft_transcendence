import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import api from '../apis/api';
import clsx from 'clsx';
import classes from './Game.module.scss';
import styles from './Game.module.scss';
import Dropdown from './components/Dropdown/Dropdown.module';
import Pong from './components/Pong/Pong.module';

function Game() {
  const [activeGameVue, setActiveGameVue] =
    useState<string>('choosePlayOrWatch');

  /*useEffect(() => {
    api
      .get('/auth/status')
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => setUser(null));
  }, []);*/

  const ftShowGameVue: any = (divName: string) => {
    if (divName === activeGameVue) return classes.showGameVue;
    else return classes.hideGameVue;
  };

  const itemsScoreLimit = [
    { id: 1, value: '3' },
    { id: 2, value: '7' },
    { id: 3, value: '10' },
  ];
  const itemsBallSpeed = [
    { id: 1, value: 'Normal' },
    { id: 2, value: 'Low' },
    { id: 3, value: 'Fast' },
  ];
  const itemsFieldColor = [
    { id: 1, value: 'Black' },
    { id: 2, value: 'White' },
    { id: 3, value: 'Green' },
    { id: 4, value: 'Blue' },
    { id: 5, value: 'Red' },
  ];
  const itemsBallColor = [
    { id: 1, value: 'White' },
    { id: 2, value: 'Black' },
    { id: 3, value: 'Green' },
    { id: 4, value: 'Blue' },
    { id: 5, value: 'Red' },
  ];
  const itemsYourColor = [
    { id: 1, value: 'White' },
    { id: 2, value: 'Black' },
    { id: 3, value: 'Green' },
    { id: 4, value: 'Blue' },
    { id: 5, value: 'Red' },
  ];
  const itemsOpponentcolor = [
    { id: 1, value: 'White' },
    { id: 2, value: 'Black' },
    { id: 3, value: 'Green' },
    { id: 4, value: 'Blue' },
    { id: 5, value: 'Red' },
  ];
  const itemsOpponent = [
    { id: 1, value: 'Random' },
    { id: 2, value: 'Ramzi' },
    { id: 3, value: 'Sommecaise' },
  ];
  const itemsPartyType = [
    { id: 1, value: 'Join' },
    { id: 2, value: 'Create' },
  ];
  const itemsPartyType2 = [
    { id: 1, value: 'Default' },
    { id: 2, value: 'Customized' },
  ];

  return (
    <div className={clsx(classes.Game)}>
      <div
        className={clsx(
          classes.playOrWatch,
          ftShowGameVue('choosePlayOrWatch')
        )}
      >
        <button
          className={clsx(classes.configButton, classes.butttonGame)}
          onClick={() => setActiveGameVue('chooseGameType')}
        >
          Play a game
        </button>
        <button className={clsx(classes.configButton, classes.butttonGame)}>
          Watch other users play
        </button>
      </div>

      <div
        className={clsx(
          classes.chooseGameType,
          ftShowGameVue('chooseGameType')
        )}
      >
        <button
          className={clsx(classes.configButton, classes.butttonGame)}
          onClick={() => setActiveGameVue('chooseCustomization')}
        >
          Room
        </button>
        <button className={clsx(classes.configButton, classes.butttonGame)}>
          Current game invites
        </button>
      </div>

      <div
        className={clsx(
          classes.chooseCustomization,
          ftShowGameVue('chooseCustomization')
        )}
      >
        <div
          className={clsx(
            classes.customizationSection,
            classes.customizationSectionTop
          )}
        >
          <Dropdown title="Score Limit" items={itemsScoreLimit} />
          <Dropdown title="Ball speed" items={itemsBallSpeed} />
          <Dropdown title="Field color" items={itemsFieldColor} />
        </div>
        <div
          className={clsx(
            classes.customizationSection,
            classes.customizationSectionMiddle
          )}
        >
          <Dropdown title="Ball color" items={itemsBallColor} />
          <Dropdown title="Your color" items={itemsYourColor} />
          <Dropdown title="Opponent's color" items={itemsOpponentcolor} />
        </div>
        <div
          className={clsx(
            classes.customizationSection,
            classes.customizationSectionBottom
          )}
        >
          <Dropdown title="Opponent" items={itemsOpponent} />
          <Dropdown title="Create/Join" items={itemsPartyType} />
          <Dropdown title="Default/Customized" items={itemsPartyType2} />
        </div>
        <button
          className={clsx(classes.configButton, classes.playButton)}
          onClick={() => setActiveGameVue('pong')}
        >
          PLAY
        </button>
      </div>

      <div className={clsx(classes.pong, ftShowGameVue('pong'))}>
        <Pong />
      </div>
    </div>
  );
}

export default Game;
