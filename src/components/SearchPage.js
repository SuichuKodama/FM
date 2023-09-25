/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import * as Api from "../service/firebase";
import SearchCardList from "./SearchCardList";

export default function SearchPage() {
  const [cards, setCards] = useState([]);

  const location = useLocation();
  const searchQuery = location.search;
  console.log(searchQuery, "searchQuery");

  // URLからクエリ文字列を取り出す
  const query = new URLSearchParams(searchQuery);
  const word = query.get("tag"); // tagパラメーターの値を取得
  console.log(word, "search");

  // fetchSearchDataを取得
  useEffect(() => {
    fetchSearchData();
  }, []);

  // 検索結果を取得
  const fetchSearchData = async () => {
    let searchResults = await Api.performSearchAsync(word);
    await setCards(searchResults);
  };

  return (
    <>
      <SearchCardList cards={cards} />
    </>
  );
}
