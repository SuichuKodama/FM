/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Link } from 'react-router-dom';

export default function CardList(props) {
  return (
    <section>
      <div className='card_list'>
        {props.cards.map((card) => (
          <div
            css={css`
              position: relative;
            `}
            key={card.id}
            href={'/recipe/' + card.id}
            className='card'
          >
            <Link
              css={css`
                position: absolute;
                inset: 0;
              `}
              to={'/recipe/' + card.id}
            />
            <img className='main_image' src={card.mvURL} alt='フライの画像' />
            <div className='title'>{card.title}</div>
            <div className='text'>{card.description}</div>
            <div className='tag_list'>
              {card.materials.map((tag) => (
                <Link
                  css={css`
                    z-index: 1;
                  `}
                  className='material'
                  href={'?keyword=' + tag}
                  key={tag}
                >
                  <span>{tag}</span>
                </Link>
              ))}
            </div>
            <div className='tag_list'>
              {card.tags.map((tag) => (
                <Link
                  css={css`
                    z-index: 1;
                  `}
                  className='tag'
                  href={'?keyword=%23' + tag}
                  key={tag}
                >
                  <span>#</span>
                  <span>{tag}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
