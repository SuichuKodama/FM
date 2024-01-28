import * as Api from '../service/firebase';
import RecipeTop from './RecipeTop';
import { useParams } from 'react-router';
import StepList from './StepList';
import useSWR from 'swr';

const fetcher = (id) => {
  return Api.getStep(id);
};

function Recipe() {
  let { id } = useParams();
  const { data } = useSWR(id, fetcher);

  return (
    <>
      <div className='recipe_container'>
        <section className='recipe'>
          <RecipeTop />
          {data && <StepList steps={data} />}
        </section>
        <div className='side_container'>
          <nav className='recipe_nav_bar'>
            <div className='recipe_btn_list'>
              <a href='/' className='top_btn'>
                トップ
              </a>
              <a href='/input/' className='input_btn'>
                投稿ページ
              </a>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Recipe;
