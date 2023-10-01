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
    const searchResult = await Api.searchAsync(keyword);
    await setCards(searchResult);
  };

  return (
    <>
      <header className="header">
        <div className="text">Fly Mark</div>
      </header>
      <div className="top_container">
        <section className="hero">
          <div className="search_container">
            <h1 className="heading_title">FlyMark</h1>
            <div className="lead_container">
              新しいフライレシピを見つける
              <br />
              オリジナルのフライレシピを投稿する
              <br />
              まだ知らないレシピを見つけよう
            </div>
            <div className="input_container">
              <input
                className="input"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="例：#ハゼ #ハゼフライ "
              />
              <button className="search_btn" onClick={handleSearch}>
                検索
              </button>
            </div>
            <nav className="nav_bar">
              <a href="/input/" className="item">
                投稿ページ
              </a>
            </nav>
          </div>
        </section>
        <main className="list_container">
          {/* CardListコンポーネントにcardsステートを渡す */}
          <CardList cards={cards} />
        </main>
      </div>
      <Footer />
    </>
  );
}

export default TopPage;
