import { useEffect, useState } from "react";

export default function StepList(props) {
  const [stepList, setStepList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const fetchedSteps = await Promise.all(
        props.steps.map(async (step) => {
          return {
            id: step.id,
            imgURL: step.imgURL,
            note: step.note,
          };
        })
      );
      setStepList(fetchedSteps);
    }
    fetchData();
  }, [props.steps]);

  return (
    <div className="how_to">
      <div className="title">作り方</div>
      <ul className="list">
        {stepList.map((step) => {
          return (
            <li className="item" key={step.id}>
              <div className="number"></div>
              <div className="info">
                <div>{step.note}</div>
                <img className="img" src={step.imgURL} alt="" />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
