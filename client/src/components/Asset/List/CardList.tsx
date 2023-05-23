import React from 'react';
import { CardDataType } from '../../../util/api/assetAPI';
import classes from './CardList.module.css';

interface CardListProps {
  className?: string;
  cards: CardDataType[];
}

const CardList = ({ className, cards }: CardListProps) => {  
  return (
    <ul className={`${classes.container} ${className}`}>
      {cards.map((card) => (
        <li key={card._id} className={classes.card}>
          <p className={classes.type}>{card.detail === 'credit' ? '신용카드' : '체크카드'}</p>
          <p className={classes.title}>{card.title}</p>
        </li>
      ))}
    </ul>
  );
};

export default CardList;
