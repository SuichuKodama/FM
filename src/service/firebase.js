import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { enableNetwork } from "firebase/firestore";
import "firebase/compat/storage";

firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
});

const db = firebase.firestore();
const storage = firebase.storage();

await enableNetwork(db);

export const getCollectionById = async (recipeId) => {
  try {
    const documentRef = db.collection("recipes").doc(recipeId);
    const doc = await documentRef.get();
    if (doc.exists) {
      let documentData = {
        id: doc.id,
        title: doc.data().title,
        mvURL: doc.data().mvURL,
        description: doc.data().description,
        date: doc.data().date,
        tags: doc.data().tags,
        materials: doc.data().materials,
      };
      return documentData;
    } else {
      // ドキュメントが存在しない場合の処理
      return null;
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    throw error;
  }
};

export const getStep = async (id) => {
  const step = await db
    .collection("recipes")
    .doc(id)
    .collection("step")
    .orderBy("step", "asc");

  return step.get().then((snapShot) => {
    let steps = [];
    snapShot.forEach((doc) => {
      // console.log(steps, steps);

      steps.push({
        id: doc.id,
        imgURL: doc.data().imgURL,
        step: doc.data().step,
        note: doc.data().note,
      });
    });

    return steps;
  });
};

export const addPostAsync = async (
  id,
  title,
  mvURL,
  description,
  tags,
  materials
) => {
  let date = new Date();
  // 'recipes'というコレクションにデータを追加
  await db.collection("recipes").doc(id).set({
    title: title,
    mvURL: mvURL,
    description: description,
    date: date,
    tags: tags,
    materials: materials,
  });

  let postRef = db.collection("recipes").doc(id);
  return postRef;
};

export const addStepAsync = async (id, step) => {
  const stepDoc = await db
    .collection("recipes")
    .doc(id)
    .collection("step")
    .add({
      step: step.step, // 連番のステップを設定
      note: step.note, // レシピステップのテキスト
      imgURL: step.imgURL, // 画像のファイル名
    });

  return stepDoc;
};

export const uploadMvImgAsync = async (recipeId, file) => {
  // ストレージにファイルをアップロード
  const mvFileRef = storage.ref(`/mv/${recipeId}`).child(file.name);
  await mvFileRef.put(file);
  let imgURL = await mvFileRef.getDownloadURL();
  return imgURL;
};

export const uploadImageAsync = async (recipeId, file) => {
  // ストレージにファイルをアップロード
  let imgFileRef = storage.ref(`/step/${recipeId}`).child(file.name);

  try {
    // ファイルを Firebase Storage にアップロード
    await imgFileRef.put(file);
    // アップロードが完了したら、ダウンロード URL を取得
    let imgURL = await imgFileRef.getDownloadURL();
    return imgURL;
  } catch (error) {
    console.error("ファイルのアップロードエラー:", error);
  }
};

export const searchAsync = async (keyword) => {
  try {
    let recipes;
    if (keyword === null) {
      recipes = await db
        .collection("recipes")
        .orderBy("date", "desc")
        .limit(10)
        .get();
    } else if (keyword.startsWith("#")) {
      // コレクション名を指定してクエリを作成
      // "tags" フィールドが指定の文字列と一致する条件
      recipes = await db
        .collection("recipes")
        .where("tags", "array-contains", keyword.substring(1))
        .limit(10)
        .get();
    } else {
      recipes = await db
        .collection("recipes")
        .where("materials", "array-contains", keyword)
        .limit(10)
        .get();
    }
    // クエリ結果を配列に変換して返す
    let cards = [];
    recipes.forEach((doc) => {
      cards.push({
        id: doc.id,
        title: doc.data().title,
        mvURL: doc.data().mvURL,
        description: doc.data().description,
        date: doc.data().date,
        tags: doc.data().tags,
        materials: doc.data().materials,
      });
    });
    return cards;
  } catch (error) {
    throw error;
  }
};
