/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useState } from 'react';
import * as Api from "../service/firebase"
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { v4 as uuidv4 } from 'uuid';

function Input() {

  const [title, setTitle] = useState('');
  const [mvFile, setMvFile] = useState({});
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState([]);
  const [tags, setTags] = useState([]);
  const [steps, setSteps] = useState([]);
  const [files, setFiles] = useState([]);

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
    setMvFile(file);
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
    let existingFile = files.find((f) => f.index === index)
    if (existingFile !== undefined) {
      existingFile.file = file;
      setFiles([...files]);
    }
    else {
      setFiles([...files, { index: index, file: file }]);
    }
  };

  async function uploadMvImgeAsync(id, file) {
    // ストレージにファイルをアップロード
    const storage = firebase.storage();
    const mvFileRef = storage.ref(`mv/${id}`).child(mvFile.name);
    await mvFileRef.put(file);
    let imgURL = await mvFileRef.getDownloadURL();
    return imgURL;
  }

  async function uploadImageAsync(postId, file) {
    // ストレージにファイルをアップロード
    let storage = firebase.storage();
    let imgFileRef = storage.ref(`/step/${postId}`).child(file.name);

    try {
      // ファイルを Firebase Storage にアップロード
      await imgFileRef.put(file);

      // アップロードが完了したら、ダウンロード URL を取得
      let imgURL = await imgFileRef.getDownloadURL();
      return imgURL;
    } catch (error) {
      console.error('ファイルのアップロードエラー:', error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let uuid = uuidv4();
    let mvURL = mvFile? await uploadMvImgeAsync(uuid, mvFile):'';
    let postRef = await Api.addPostAsync(uuid, title, mvURL, description, tags, materials);

    let uploadImageList = [];
    await Promise.all(files.map(async (file) => {
      let imgURL = await uploadImageAsync(postRef.id, file.file);
      uploadImageList.push({ index: file.index, imgURL: imgURL });
    }));

    // レシピステップを追加
    await Promise.all(steps.map(async (step, index) => {
      step.step = index + 1;
      let uploadImage = uploadImageList.find((img) => img.index === index);
      step.imgURL = uploadImage ? uploadImage.imgURL : '';
      await Api.addStepAsync(postRef.id, step);
    }));

    // フォームをリセット
    setTitle('');
    setMvFile({});
    setDescription('');
    setTags([]);
    setMaterials([]);
    setSteps([]);
  };

  return (
    <>
      <header css={css`
        width: 100%;
        height: 40px;
        background-color: var(--primary-s-color);
      `}>
        <div
          css={css`
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--primary-color);
        font-size: 11px;
        line-height: 1;
        `}>
          レシピを書く
        </div>
      </header>

      <section>
        <form onSubmit={handleSubmit}>
          <div>
            <input type="file" name="file" onChange={(e) => handleMvFileChange(e.target.files[0])} />
          </div>
          <div>
            <label htmlFor="">タイトル<input type="text" value={title} onChange={(e) => setTitle(e.target.value)} /></label>
          </div>
          <div>
            <div>フライの説明</div>
            <textarea name="" id="" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
          </div>
          <div>
            <div>材料</div>
            <ul>
              {materials.map((material, index) => (
                <li key={index}>
                  <div>
                    <input
                      type="text"
                      value={material}
                      onChange={(e) => handleMaterialChange(index, e.target.value)}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <button type="button" onClick={addMaterial}>
              材料を追加する
            </button>
          </div>
          <div>
            <div>タグを付ける</div>
            <ul>
              {tags.map((tag, index) => (
                <li key={index}>
                  <div>
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleTagChange(index, e.target.value)}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <button type="button" onClick={addTag}>
              タグを追加する
            </button>
          </div>
          <div>
            <div>作り方</div>
            <ul>
              {steps.map((step, index) => (
                <li key={index}>
                  <div>
                    <input
                      type="text"
                      value={step.note}
                      onChange={(e) => handleStepNoteChange(index, e.target.value)}
                    />
                    <input
                      type="file"
                      name="file"
                      onChange={(e) => handleStepImageChange(index, e.target.files[0])}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <button type="button" onClick={addStep}>
              ステップを追加する
            </button>
          </div>
          <div className="post_footer">
            <a href="/">キャンセル</a>
            <button onClick={handleSubmit}>追加</button>
          </div>
        </form>
      </section>
    </>
  );
}

export default Input;
