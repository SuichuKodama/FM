/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import * as Api from "../service/firebase";
import CardList from "./CardList";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

function TopPage() {
  // cardsステートをuseStateを使用して初期化
  const [cards, setCards] = useState([]);
  // const [searchResults, setSearchResults] = useState([]);
  const [keyword, setKeyword] = useState("");
  const location = useLocation();
  const searchQuery = location.search;
  const query = new URLSearchParams(searchQuery);

  // Post取得
  useEffect(() => {
    fetch();
  }, []);


  const fetch = async () => {
    let keyword = query.get("keyword");
    setKeyword(keyword);
    const data = await Api.searchAsync(keyword);
    await setCards(data);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    // navigate(`/search?tag=${word}`);
    // setWord("");
    const searchResult = await Api.searchAsync(keyword);
    await setCards(searchResult);
  };

  return (
    <>
      <header className="header">
        <div className="text">Fly Mark</div>
      </header>
      <nav className="nav_bar">
        <div className="list">
          <a href="/input/" className="item">
            投稿
          </a>
        </div>
      </nav>

      <main className="list_container">
        <section className="hero">
          <div className="container">
            作りたいフライレシピが見つかる、投稿できる。
            <br />
            オリジナルのフライレシピを投稿して日本中のフライフィッシャーと繋がろう。
          </div>
          <div>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="タグ検索"
            />
            <button onClick={handleSearch}>検索</button>
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
