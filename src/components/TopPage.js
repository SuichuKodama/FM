import React, { useCallback, useState } from 'react';
import * as Api from '../service/firebase';
import CardList from './CardList';
import useSWR from 'swr';
import { Link } from 'react-router-dom';

const fetcher = (keyword) => {
  return Api.searchAsync(keyword);
};

function TopPage() {
  const query = new URLSearchParams();
  const [keyword, setKeyword] = useState(query.get('keyword') ?? '');
  const [input, setInput] = useState('');
  const { data } = useSWR(keyword, fetcher);

  const handleChangeInput = useCallback((e) => {
    setInput(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setKeyword(input);
    },
    [input]
  );

  return (
    <>
      <div className='top_container'>
        <section className='hero'>
          <div className='search_container'>
            <h1 className='heading_title'>FlyMark</h1>
            <div className='lead_container'>
              新しいフライレシピを見つける
              <br />
              オリジナルのフライレシピを投稿する
              <br />
              まだ知らないレシピに出会おう
            </div>
            <form className='input_container' onSubmit={handleSubmit}>
              <input
                className='input'
                type='text'
                value={input}
                onChange={handleChangeInput}
                placeholder='例：#ハゼ #ハゼフライ '
              />
              <button className='search_btn'>検索</button>
            </form>
            <nav className='nav_bar'>
              <Link to='/input/' className='item'>
                投稿ページ
              </Link>
            </nav>
          </div>
        </section>
        <main className='list_container'>
          {/* CardListコンポーネントにcardsステートを渡す */}
          {data && <CardList cards={data} />}
        </main>
      </div>
    </>
  );
}

export default TopPage;
