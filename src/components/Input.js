/** @jsxImportSource @emotion/react */
import { useCallback, useState } from 'react';
import * as Api from '../service/firebase';
import 'firebase/compat/firestore';
import { v4 as uuidv4 } from 'uuid';
import Footer from './Footer';
import { css } from '@emotion/react';
import { Link } from 'react-router-dom';

function Input() {
  const [title, setTitle] = useState('');
  const [mvFile, setMvFile] = useState({});
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState(['']);
  const [tags, setTags] = useState(['']);
  const [steps, setSteps] = useState(['']);
  const [files, setFiles] = useState([]);
  const [selectedMvImage, setSelectedMvImage] = useState(null);
  const [selectedStepImages, setSelectedStepImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // 新しい材料の追加
  const addMaterial = () => {
    setMaterials([...materials, '']); // 現在の材料一覧に新しい要素（空の文字列）を追加します
  };

  const addTag = () => {
    setTags([...tags, '']);
  };

  const addStep = () => {
    setSteps([...steps, { note: '', imgURL: '' }]);
  };

  // 特定の材料の値を変更
  const handleMaterialChange = (index, value) => {
    const newMaterials = [...materials]; // 現在の材料一覧をコピー
    newMaterials[index] = value; // 指定したインデックスの材料を新しい値に更新
    setMaterials(newMaterials); // 材料のステートを更新
  };

  const handleTagChange = (index, value) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  const handleMvFileChange = (file) => {
    if (file) {
      setMvFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedMvImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // 画像が選択されていない場合
      setMvFile({});
      setSelectedMvImage(null);
    }
  };

  const handleStepNoteChange = (index, note) => {
    const newSteps = [...steps];

    if (newSteps[index]) {
      newSteps[index].id = index;
      newSteps[index].note = note; // テキストを note フィールドに設定
    } else {
      newSteps[index] = { note }; // note フィールドに設定
    }

    setSteps(newSteps);
  };

  const handleStepImageChange = async (index, file) => {
    let existingFile = files.find((f) => f.index === index);

    if (existingFile !== undefined) {
      existingFile.file = file;
      setFiles([...files]);
    } else {
      setFiles([...files, { index: index, file: file }]);
    }

    const newSelectedStepImages = [...selectedStepImages];
    newSelectedStepImages[index] = file ? URL.createObjectURL(file) : null;
    setSelectedStepImages(newSelectedStepImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let uuid = uuidv4();
    let mvURL = mvFile ? await Api.uploadMvImgAsync(uuid, mvFile) : '';
    let postRef = await Api.addPostAsync(
      uuid,
      title,
      mvURL,
      description,
      tags,
      materials
    );

    // let uploadImageList = [];
    // await Promise.all(
    //   files.map(async (file) => {
    //     let imgURL = await Api.uploadImageAsync(postRef.id, file.file);
    //     uploadImageList.push({ index: file.index, imgURL: imgURL });
    //   })
    // );

    // // レシピステップを追加
    // await Promise.all(
    //   steps.map(async (step, index) => {
    //     step.step = index + 1;
    //     let uploadImage = uploadImageList.find((img) => img.index === index);
    //     step.imgURL = uploadImage ? uploadImage.imgURL : "";
    //     await Api.addStepAsync(postRef.id, step);
    //   })
    // );

    try {
      setLoading(true);
      let uploadImageList = [];
      await Promise.all(
        files.map(async (file) => {
          let imgURL = await Api.uploadImageAsync(postRef.id, file.file);
          uploadImageList.push({ index: file.index, imgURL: imgURL });
        })
      );

      // レシピステップを追加
      await Promise.all(
        steps.map(async (step, index) => {
          step.step = index + 1;
          let uploadImage = uploadImageList.find((img) => img.index === index);
          step.imgURL = uploadImage ? uploadImage.imgURL : '';
          await Api.addStepAsync(postRef.id, step);
        })
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }

    // フォームをリセット
    setTitle('');
    setMvFile({});
    setDescription('');
    setTags(['']);
    setMaterials(['']);
    setSteps(['']);
    setSelectedMvImage(null);
    setSelectedStepImages([]);
    setLoading(false);
  };

  return (
    <section className='input_page'>
      <header className='input_header'>
        <div className='text'>レシピを書く</div>
      </header>
      <section className='input_window'>
        <form className='form_container' onSubmit={handleSubmit}>
          <AddPicture picture={selectedMvImage} onChange={handleMvFileChange} />
          <InputBox title='タイトル'>
            <input
              css={css`
                width: 100%;
                height: calc(30 * var(--basis-window-size));
                background-color: transparent;
                padding: calc(6 * var(--basis-window-size))
                  calc(8 * var(--basis-window-size));
                font-size: calc(14 * var(--basis-window-size));
                font-weight: bold;
                letter-spacing: 0.06em;
              `}
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='例) ピーコックパラシュート'
            />
          </InputBox>
          <InputBox title='フライの説明'>
            <textarea
              className='textarea'
              css={css`
                width: 100%;
                height: calc(60 * var(--basis-window-size));
                padding: calc(6 * var(--basis-window-size))
                  calc(8 * var(--basis-window-size));
                font-size: calc(10 * var(--basis-window-size));
                font-weight: normal;
                letter-spacing: 0.06em;
                background-color: rgba(255, 255, 255, 0.65);
              `}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='例) コカゲロウなど各種メイフライのハッチに使用。パイロットフライとしても効果的で、釣り上がりにもおすすめ。'
            ></textarea>
          </InputBox>
          <InputBox title='材料'>
            <ul>
              {materials.map((material, index) => (
                <li key={index}>
                  <div className='inner_container _materials'>
                    <input
                      className='multiple_input _materials'
                      type='text'
                      value={material}
                      onChange={(e) =>
                        handleMaterialChange(index, e.target.value)
                      }
                      placeholder='例) ピーコック'
                    />
                  </div>
                </li>
              ))}
            </ul>
            <AddItemButton label='材料を追加' onClick={addMaterial} />
          </InputBox>
          <InputBox title='タグを付ける'>
            <ul>
              {tags.map((tag, index) => (
                <li key={index}>
                  <div className='inner_container _tags'>
                    <input
                      className='multiple_input _tags'
                      type='text'
                      value={tag}
                      onChange={(e) => handleTagChange(index, e.target.value)}
                      placeholder='例) ドライフライ'
                    />
                  </div>
                </li>
              ))}
            </ul>
            <AddItemButton label='タグを追加' onClick={addTag} />
          </InputBox>
          <InputBox title='作り方'>
            <ul className='input_recipe_list'>
              {steps.map((step, index) => (
                <li className='input_recipe_item' key={index}>
                  <div
                    className={`multiple_input_wrap _recipes ${
                      selectedStepImages[index] ? 'selected' : ''
                    }`}
                  >
                    <textarea
                      className={`multiple_input _recipes ${
                        selectedStepImages[index] ? 'selected' : ''
                      }`}
                      value={step.note}
                      onChange={(e) =>
                        handleStepNoteChange(index, e.target.value)
                      }
                      placeholder='例) コカゲロウなど各種メイフライのハッチに使用。パイロットフライとしても効果的で、釣り上がりにもおすすめ。'
                    ></textarea>
                    <label
                      className={`stepImg_input_btn ${
                        selectedStepImages[index] ? 'selected' : ''
                      }`}
                    >
                      <input
                        className='input'
                        type='file'
                        name='file'
                        onChange={(e) =>
                          handleStepImageChange(index, e.target.files[0])
                        }
                      />
                      {selectedStepImages[index] ? (
                        <div className='stepImg_inner_container selected'>
                          <img
                            className='mv_img'
                            src={selectedStepImages[index]}
                            alt='選択された画像'
                          />
                        </div>
                      ) : (
                        <div className='stepImg_inner_container'>
                          <svg className='icon' viewBox='0 0 36 31.5'>
                            <path
                              d='M36,10.125v20.25a3.376,3.376,0,0,1-3.375,3.375H3.375A3.376,3.376,0,0,1,0,30.375V10.125A3.376,3.376,0,0,1,3.375,6.75H9.563l.865-2.313A3.37,3.37,0,0,1,13.584,2.25h8.824a3.37,3.37,0,0,1,3.157,2.187l.872,2.313h6.188A3.376,3.376,0,0,1,36,10.125ZM26.438,20.25A8.438,8.438,0,1,0,18,28.688,8.444,8.444,0,0,0,26.438,20.25Zm-2.25,0A6.188,6.188,0,1,1,18,14.063,6.2,6.2,0,0,1,24.188,20.25Z'
                              transform='translate(0 -2.25)'
                            />
                          </svg>
                        </div>
                      )}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
            <AddItemButton label='作り方を追加' onClick={addStep} />
          </InputBox>
          <div className='input_footer'>
            <Link className='cancel_btn' to='/'>
              キャンセル
            </Link>
            <button className='input_btn' disabled={loading}>
              {loading ? '投稿中...' : '投稿する'}
            </button>
          </div>
        </form>
      </section>
      <Footer />
    </section>
  );
}

export default Input;

function InputBox({ title, children }) {
  return (
    <div
      css={css`
        width: 100%;
        border-bottom: solid 1px var(--primary-color);
        color: var(--primary-color);
        margin-top: calc(20 * var(--basis-window-size));
      `}
    >
      <div>
        <div
          css={css`
            font-size: calc(12 * var(--basis-window-size));
            font-weight: bold;
            line-height: 1;
            margin-bottom: calc(6 * var(--basis-window-size));
          `}
        >
          {title}
        </div>
        {children}
      </div>
    </div>
  );
}

function AddPicture({ picture, onChange }) {
  const handleChange = useCallback(
    (e) => {
      onChange(e.target.files[0]);
    },
    [onChange]
  );

  return (
    <label
      css={css`
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: calc(200 * var(--basis-window-size));
        box-sizing: border-box;
        border-radius: calc(10 * var(--basis-window-size));
        cursor: pointer;
        overflow: hidden;
      `}
    >
      <input type='file' name='file' onChange={handleChange} />
      {picture ? (
        <div
          css={css`
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: calc(10 * var(--basis-window-size)) 0;
            font-size: calc(10 * var(--basis-window-size));
            font-weight: bold;
            color: white;
          `}
        >
          <img
            css={css`
              display: block;
              width: 100%;
              height: 100%;
              object-fit: cover;
            `}
            src={picture}
            alt='選択された画像'
          />
        </div>
      ) : (
        <div
          css={css`
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: calc(10 * var(--basis-window-size)) 0;
            font-size: calc(10 * var(--basis-window-size));
            font-weight: bold;
            color: var(--primary-color);
            background-color: var(--primary-s-color);
          `}
        >
          <div>タップしてフライの写真をのせる</div>

          <svg
            css={css`
              aspect-ratio: 36/31.5;
              height: calc(31 * var(--basis-window-size));
              fill: var(--primary-color);
            `}
            viewBox='0 0 36 31.5'
          >
            <path
              d='M36,10.125v20.25a3.376,3.376,0,0,1-3.375,3.375H3.375A3.376,3.376,0,0,1,0,30.375V10.125A3.376,3.376,0,0,1,3.375,6.75H9.563l.865-2.313A3.37,3.37,0,0,1,13.584,2.25h8.824a3.37,3.37,0,0,1,3.157,2.187l.872,2.313h6.188A3.376,3.376,0,0,1,36,10.125ZM26.438,20.25A8.438,8.438,0,1,0,18,28.688,8.444,8.444,0,0,0,26.438,20.25Zm-2.25,0A6.188,6.188,0,1,1,18,14.063,6.2,6.2,0,0,1,24.188,20.25Z'
              transform='translate(0 -2.25)'
            />
          </svg>
        </div>
      )}
    </label>
  );
}

function AddItemButton({ label, onClick }) {
  return (
    <button
      css={css`
        width: calc(90 * var(--basis-window-size));
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 0 calc(2 * var(--basis-window-size));
        padding: calc(6 * var(--basis-window-size))
          calc(8 * var(--basis-window-size));
        opacity: 0.5;
        margin-top: calc(4 * var(--basis-window-size));
        margin-left: auto;
        cursor: pointer;
        transition: opacity 100ms ease-in-out;

        &:hover {
          opacity: 1;
        }
      `}
      type='button'
      onClick={onClick}
    >
      <svg
        css={css`
          aspect-ratio: 1/1;
          height: calc(8 * var(--basis-window-size));
          margin-bottom: calc(2 * var(--basis-window-size));
        `}
        viewBox='0 0 23.999 23.999'
      >
        <g transform='translate(-6 -6)'>
          <path
            d='M.382-61.5v-9h-9a1.5,1.5,0,0,1-1.5-1.5,1.5,1.5,0,0,1,1.5-1.5h9v-9a1.5,1.5,0,0,1,1.5-1.5,1.5,1.5,0,0,1,1.5,1.5v9h9a1.5,1.5,0,0,1,1.5,1.5,1.5,1.5,0,0,1-1.5,1.5h-9v9a1.5,1.5,0,0,1-1.5,1.5A1.5,1.5,0,0,1,.382-61.5Z'
            transform='translate(16.118 90)'
          />
        </g>
      </svg>
      <div
        css={css`
          white-space: nowrap;
          font-size: calc(10 * var(--basis-window-size));
          font-weight: bold;
          line-height: 1;
        `}
      >
        {label}
      </div>
    </button>
  );
}
