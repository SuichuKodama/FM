/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useEffect, useState } from 'react';

export default function CardList(props) {
  const [cardList, setCardList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const fetchedCards = await Promise.all(
        props.cards.map(async (card) => {
          return {
            id: card.id,
            mvURL: card.mvURL,
            title: card.title,
            text: card.text,
            materials: card.materials,
            tags: card.tags,
          };
        })
      );
      setCardList(fetchedCards);
    }
    fetchData();
  }, [props.cards]);

  return (
    <section>
      <div className="card_list">
        {cardList.map((card) => (
          <a key={card.id} href={'/recipe/' + card.id} className="card">
            <img src={card.mvURL} alt="フライの画像" css={css`width: 100%;`} />
            <div className="title">{card.title}</div>
            <div className="text">{card.text}</div>
            <div className="tag_list">
              {card.materials.map((tag) => (
                <a className="material" href='/recipe/' key={tag}>
                  <span>#</span>
                  <span>{tag}</span>
                </a>
              ))}
              {card.tags.map((tag) => (
                <a className="tag" href='/recipe/' key={tag}>
                  <span>#</span>
                  <span>{tag}</span>
                </a>
              ))}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
