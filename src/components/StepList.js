export default function StepList(props) {
  return (
    <div className='how_to'>
      <div className='title'>作り方</div>
      <ul className='list'>
        {props.steps.map((step) => {
          return (
            <li className='item' key={step.id}>
              <div className='number'></div>
              <div className='info'>
                <div>{step.note}</div>
                <img className='img' src={step.imgURL} alt='' />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
