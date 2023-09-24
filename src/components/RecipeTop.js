/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import * as Api from "../service/firebase";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

function RecipeTop() {
  let { id } = useParams();
  const postId = id;

  // cardsステートをuseStateを使用して初期化
  const [card, setCard] = useState({
    title: "",
    mvURL: "",
    text: "",
    materials: [],
  });

  useEffect(() => {
    fetchCard();
  }, []);

  const fetchCard = async () => {
    const post = await Api.getCollectionById(postId);
    if (post) {
      console.log(post);
      await setCard(post);
    } else {
      console.log("指定されたドキュメントが存在しません。");
    }
  };

  return (
    <div>
      <div className="fly_info">
        <div className="name">{card.title}</div>
        <img
          src={card.mvURL}
          alt="フライの画像"
          css={css`width: 100%;`}
        />
        <div className="text">{card.text}</div>
      </div>
      <div className="materials">
        <div className="title">材料</div>
        <ul className="list">
          {card.materials &&
            card.materials.map((material) => {
              return <li className="item">{material}</li>;
            })}
        </ul>
      </div>
    </div>
  );
}

export default RecipeTop;
