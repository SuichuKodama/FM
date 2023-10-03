import * as Api from "../service/firebase";
import RecipeTop from "./RecipeTop";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import StepList from "./StepList";

function Recipe() {
  let { id } = useParams();

  const [steps, setSteps] = useState([]);

  useEffect(() => {
    fetchStep();
  }, []);

  const fetchStep = async () => {
    const step = await Api.getStep(id);
    await setSteps(step);
  };

  return (
    <>
      <div className="recipe_container">
        <section className="recipe">
          <RecipeTop />
          <StepList steps={steps} />
        </section>
        <div className="side_container">
          <nav className="recipe_nav_bar">
            <div className="recipe_btn_list">
              <a href="/" className="top_btn">
                トップ
              </a>
              <a href="/input/" className="input_btn">
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
