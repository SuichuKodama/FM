/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import * as Api from "../service/firebase";
import RecipeTop from './RecipeTop';
import Footer from './Footer';
import { useEffect, useState} from "react";
import { useParams } from "react-router";
import StepList from "./StepList";

function Recipe() {
  let { id } = useParams();

  const [steps, setSteps] = useState([]);

  useEffect(() => {

    fetchStep();
  }, []);

  const fetchStep = async() => {
    const step = await Api.getStep(id);
    await setSteps(step);
  };

  return (
    <>
      <header className='header'>
        <div className='text'>
          Fly Mark
        </div>
      </header>
      <section className="recipe">
        <RecipeTop/>
        <StepList steps={steps}/>
        <div>
          <button className="share_btn">リンクコピー</button>
        </div>        
      </section>

      <Footer />
    </>
  );
}

export default Recipe;

