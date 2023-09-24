/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import * as Api from "../service/firebase"
import CardList from './CardList';
import Footer from './Footer';

function TopPage() {
  // cardsステートをuseStateを使用して初期化
  const [cards, setCards] = useState([]);

  // Post取得
  useEffect(() => {
    // ここでデータを取得し、setCardsを使用してcardsステートを更新する
    fetch();
  }, [])

  const fetch = async() => {
    const data = await Api.initGet();
    await setCards(data);
  }

  return (
    <>
      <header className='header'>
        <div className='text'>
          Fly Mark
        </div>
      </header>

      <main className='list_container'>
        <section className='hero'>
          <div className='container'>
            作りたいフライレシピが見つかる、投稿できる。<br />
            オリジナルのフライレシピを投稿して日本中のフライフィッシャーと繋がろう。
          </div>
          <div>
            <input type="text" />
            <button href=''>検索</button>
          </div>
        </section>
        {/* CardListコンポーネントにcardsステートを渡す */}
        <CardList cards={cards} />
      </main>

      <Footer />
    </>
  );
}

export default TopPage;
