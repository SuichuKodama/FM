import * as Api from '../service/firebase';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';

const fetcher = (postId) => {
  return Api.getCollectionById(postId);
};

function RecipeTop() {
  const { id: postId } = useParams();
  const { data: card, isLoading } = useSWR(postId, fetcher);

  useEffect(() => {
    if (!isLoading && !card) {
      console.log('指定されたドキュメントが存在しません。');
    }
  }, [card, isLoading]);

  return (
    <div>
      <div className='fly_info'>
        <div className='name'>{card.title}</div>
        <img className='img' src={card.mvURL} alt='フライの画像' />
        <div className='text'>{card.description}</div>
      </div>
      <div className='materials'>
        <div className='title'>材料</div>
        <ul className='list'>
          {card.materials &&
            card.materials.map((material) => {
              return <li className='item'>{material}</li>;
            })}
        </ul>
      </div>
    </div>
  );
}

export default RecipeTop;
