import React, { useState } from "react";
import * as Api from "../service/firebase";
import "firebase/compat/firestore";
import { v4 as uuidv4 } from "uuid";
import Footer from "./Footer";

function Input() {
  const [title, setTitle] = useState("");
  const [mvFile, setMvFile] = useState({});
  const [description, setDescription] = useState("");
  const [materials, setMaterials] = useState([""]);
  const [tags, setTags] = useState([""]);
  const [steps, setSteps] = useState([""]);
  const [files, setFiles] = useState([]);
  const [selectedMvImage, setSelectedMvImage] = useState(null);
  const [selectedStepImages, setSelectedStepImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // 新しい材料の追加
  const addMaterial = () => {
    setMaterials([...materials, ""]); // 現在の材料一覧に新しい要素（空の文字列）を追加します
  };

  const addTag = () => {
    setTags([...tags, ""]);
  };

  const addStep = () => {
    setSteps([...steps, { note: "", imgURL: "" }]);
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
    let mvURL = mvFile ? await Api.uploadMvImgAsync(uuid, mvFile) : "";
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
          step.imgURL = uploadImage ? uploadImage.imgURL : "";
          await Api.addStepAsync(postRef.id, step);
        })
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }

    // フォームをリセット
    setTitle("");
    setMvFile({});
    setDescription("");
    setTags([""]);
    setMaterials([""]);
    setSteps([""]);
    setSelectedMvImage(null);
    setSelectedStepImages([]);
    setLoading(false);
  };

  return (
    <section className="input_page">
      <header className="input_header">
        <div className="text">レシピを書く</div>
      </header>
      <section className="input_window">
        <form className="form_container" onSubmit={handleSubmit}>
          <label className="mvImg_input_btn">
            <input
              className="input"
              type="file"
              name="file"
              onChange={(e) => handleMvFileChange(e.target.files[0])}
            />
            {selectedMvImage ? (
              <div className="inner_container selected">
                <img
                  className="mv_img"
                  src={selectedMvImage}
                  alt="選択された画像"
                />
              </div>
            ) : (
              <div className="inner_container">
                <div>タップしてフライの写真をのせる</div>

                <svg className="icon" viewBox="0 0 36 31.5">
                  <path
                    d="M36,10.125v20.25a3.376,3.376,0,0,1-3.375,3.375H3.375A3.376,3.376,0,0,1,0,30.375V10.125A3.376,3.376,0,0,1,3.375,6.75H9.563l.865-2.313A3.37,3.37,0,0,1,13.584,2.25h8.824a3.37,3.37,0,0,1,3.157,2.187l.872,2.313h6.188A3.376,3.376,0,0,1,36,10.125ZM26.438,20.25A8.438,8.438,0,1,0,18,28.688,8.444,8.444,0,0,0,26.438,20.25Zm-2.25,0A6.188,6.188,0,1,1,18,14.063,6.2,6.2,0,0,1,24.188,20.25Z"
                    transform="translate(0 -2.25)"
                  />
                </svg>
              </div>
            )}
          </label>
          <div className="input_box">
            <label className="title_input_btn">
              <div className="note">タイトル</div>
              <input
                className="input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例) ピーコックパラシュート"
              />
            </label>
          </div>
          <div className="input_box">
            <div className="description_input_title">フライの説明</div>
            <textarea
              className="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="例) コカゲロウなど各種メイフライのハッチに使用。パイロットフライとしても効果的で、釣り上がりにもおすすめ。"
            ></textarea>
          </div>
          <div className="input_box">
            <div className="materials_input_title">材料</div>
            <ul>
              {materials.map((material, index) => (
                <li key={index}>
                  <div className="inner_container _materials">
                    <input
                      className="multiple_input _materials"
                      type="text"
                      value={material}
                      onChange={(e) =>
                        handleMaterialChange(index, e.target.value)
                      }
                      placeholder="例) ピーコック"
                    />
                  </div>
                </li>
              ))}
            </ul>
            <button
              className="multiple_input_btn"
              type="button"
              onClick={addMaterial}
            >
              <svg className="icon" viewBox="0 0 23.999 23.999">
                <g transform="translate(-6 -6)">
                  <path
                    d="M.382-61.5v-9h-9a1.5,1.5,0,0,1-1.5-1.5,1.5,1.5,0,0,1,1.5-1.5h9v-9a1.5,1.5,0,0,1,1.5-1.5,1.5,1.5,0,0,1,1.5,1.5v9h9a1.5,1.5,0,0,1,1.5,1.5,1.5,1.5,0,0,1-1.5,1.5h-9v9a1.5,1.5,0,0,1-1.5,1.5A1.5,1.5,0,0,1,.382-61.5Z"
                    transform="translate(16.118 90)"
                  />
                </g>
              </svg>
              <div className="text">材料を追加</div>
            </button>
          </div>
          <div className="input_box">
            <div className="tags_input_title">タグを付ける</div>
            <ul>
              {tags.map((tag, index) => (
                <li key={index}>
                  <div className="inner_container _tags">
                    <input
                      className="multiple_input _tags"
                      type="text"
                      value={tag}
                      onChange={(e) => handleTagChange(index, e.target.value)}
                      placeholder="例) ドライフライ"
                    />
                  </div>
                </li>
              ))}
            </ul>
            <button
              className="multiple_input_btn _tags"
              type="button"
              onClick={addTag}
            >
              <svg className="icon" viewBox="0 0 23.999 23.999">
                <g transform="translate(-6 -6)">
                  <path
                    d="M.382-61.5v-9h-9a1.5,1.5,0,0,1-1.5-1.5,1.5,1.5,0,0,1,1.5-1.5h9v-9a1.5,1.5,0,0,1,1.5-1.5,1.5,1.5,0,0,1,1.5,1.5v9h9a1.5,1.5,0,0,1,1.5,1.5,1.5,1.5,0,0,1-1.5,1.5h-9v9a1.5,1.5,0,0,1-1.5,1.5A1.5,1.5,0,0,1,.382-61.5Z"
                    transform="translate(16.118 90)"
                  />
                </g>
              </svg>

              <div className="text">タグを追加</div>
            </button>
          </div>
          <div className="input_box">
            <div className="recipes_input_title">作り方</div>
            <ul className="input_recipe_list">
              {steps.map((step, index) => (
                <li className="input_recipe_item" key={index}>
                  <div
                    className={`multiple_input_wrap _recipes ${
                      selectedStepImages[index] ? "selected" : ""
                    }`}
                  >
                    <textarea
                      className={`multiple_input _recipes ${
                        selectedStepImages[index] ? "selected" : ""
                      }`}
                      value={step.note}
                      onChange={(e) =>
                        handleStepNoteChange(index, e.target.value)
                      }
                      placeholder="例) コカゲロウなど各種メイフライのハッチに使用。パイロットフライとしても効果的で、釣り上がりにもおすすめ。"
                    ></textarea>
                    <label
                      className={`stepImg_input_btn ${
                        selectedStepImages[index] ? "selected" : ""
                      }`}
                    >
                      <input
                        className="input"
                        type="file"
                        name="file"
                        onChange={(e) =>
                          handleStepImageChange(index, e.target.files[0])
                        }
                      />
                      {selectedStepImages[index] ? (
                        <div className="stepImg_inner_container selected">
                          <img
                            className="mv_img"
                            src={selectedStepImages[index]}
                            alt="選択された画像"
                          />
                        </div>
                      ) : (
                        <div className="stepImg_inner_container">
                          <svg className="icon" viewBox="0 0 36 31.5">
                            <path
                              d="M36,10.125v20.25a3.376,3.376,0,0,1-3.375,3.375H3.375A3.376,3.376,0,0,1,0,30.375V10.125A3.376,3.376,0,0,1,3.375,6.75H9.563l.865-2.313A3.37,3.37,0,0,1,13.584,2.25h8.824a3.37,3.37,0,0,1,3.157,2.187l.872,2.313h6.188A3.376,3.376,0,0,1,36,10.125ZM26.438,20.25A8.438,8.438,0,1,0,18,28.688,8.444,8.444,0,0,0,26.438,20.25Zm-2.25,0A6.188,6.188,0,1,1,18,14.063,6.2,6.2,0,0,1,24.188,20.25Z"
                              transform="translate(0 -2.25)"
                            />
                          </svg>
                        </div>
                      )}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
            <button
              className="multiple_input_btn"
              type="button"
              onClick={addStep}
            >
              <svg className="icon" viewBox="0 0 23.999 23.999">
                <g transform="translate(-6 -6)">
                  <path
                    d="M.382-61.5v-9h-9a1.5,1.5,0,0,1-1.5-1.5,1.5,1.5,0,0,1,1.5-1.5h9v-9a1.5,1.5,0,0,1,1.5-1.5,1.5,1.5,0,0,1,1.5,1.5v9h9a1.5,1.5,0,0,1,1.5,1.5,1.5,1.5,0,0,1-1.5,1.5h-9v9a1.5,1.5,0,0,1-1.5,1.5A1.5,1.5,0,0,1,.382-61.5Z"
                    transform="translate(16.118 90)"
                  />
                </g>
              </svg>
              <div className="text">作り方を追加</div>
            </button>
          </div>
          <div className="input_footer">
            <a className="cancel_btn" href="/">
              キャンセル
            </a>
            <button
              className="input_btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "投稿中..." : "投稿する"}
            </button>
          </div>
        </form>
      </section>
      <Footer />
    </section>
  );
}

export default Input;
