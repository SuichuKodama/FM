/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useState, useEffect } from "react";

export default function SearchCardList(props) {
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
    <div>
      <header className="header">
        <div className="text">Fly Mark</div>
      </header>
      <nav className="nav_bar">
        <div className="list">
          <a href="/" className="item">
            トップ
          </a>
          <a href="/input/" className="item">
            投稿
          </a>
        </div>
      </nav>
      <h2
        css={css`
          text-align: center;
          margin-top: 20px;
        `}
      >
        Test Search
      </h2>
      <div className="card_list">
        {cardList.map((card) => (
          <a key={card.id} href={"/recipe/" + card.id} className="card">
            <img
              src={card.mvURL}
              alt="フライの画像"
              css={css`
                width: 100%;
              `}
            />
            <div className="title">{card.title}</div>
            <div className="text">{card.text}</div>
            <div className="tag_list">
              {card.materials.map((tag) => (
                <a className="material" href="/recipe/" key={tag}>
                  <span>#</span>
                  <span>{tag}</span>
                </a>
              ))}
            </div>
            <div className="tag_list">
              {card.tags.map((tag) => (
                <a className="tag" href="/recipe/" key={tag}>
                  <span>#</span>
                  <span>{tag}</span>
                </a>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
